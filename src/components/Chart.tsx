import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Spinner } from '@chakra-ui/react'
import { format, fromUnixTime } from 'date-fns'
import { Axis, Grid, LineSeries, XYChart, Tooltip } from '@visx/xychart'

import { useProposalVotesQuery, useProtocolProposalsQuery } from '../queries'
import { components } from '../types/schema/swagger'

interface ChartProps {
  counter?: number
}

interface ChartParams {
  protocol: string
  ref_id: string
}

const Chart: React.VFC<ChartProps> = (props) => {
  const { protocol, ref_id: refId } = useParams<ChartParams>()

  const proposals = useProtocolProposalsQuery(protocol)
  const proposal = proposals.data?.find((proposal) => (proposal.refId = refId))
  const votes = useProposalVotesQuery(proposal?.refId)

  if (!proposal || votes.isError || !votes.data) return null

  const nayVotes = votes.data?.filter((vote) => vote.choice === 0)
  const yayVotes = votes.data?.filter((vote) => vote.choice === 1)

  const nayChart = getChartData(nayVotes)
  const yayChart = getChartData(yayVotes)

  const voteTimestamps = nayChart
    .concat(yayChart)
    .map((data) => data.x)
    .sort((a, b) => a - b)
    .map((timestamp) => new Date(timestamp))

  return proposals.isLoading ? (
    <Spinner />
  ) : (
    <>
      <Box>Protocol: {protocol}</Box>
      <Box>Proposal: {proposal.title}</Box>

      <XYChart
        height={500}
        xScale={{ type: 'time', nice: true }}
        yScale={{ type: 'linear' }}
        margin={{ top: 30, right: 60, bottom: 30, left: 60 }}
      >
        <Axis orientation="left" tickFormat={powerToFormatted} />
        <Axis orientation="bottom" numTicks={5} tickFormat={timestampToFormatted} />
        <Grid columns={false} numTicks={4} />
        <LineSeries
          dataKey="Nay"
          data={nayChart}
          xAccessor={(d) => d.x}
          yAccessor={(d) => d.y}
          stroke="red"
        />
        <LineSeries
          dataKey="Yay"
          data={yayChart}
          xAccessor={(d) => d.x}
          yAccessor={(d) => d.y}
          stroke="green"
        />
      </XYChart>
    </>
  )
}

const getChartData = (votes: components['schemas']['Vote'][]) => {
  return votes
    .map((vote) => {
      return [vote.timestamp!, vote.power!]
    })
    .sort((a, b) => {
      return a[0] - b[0]
    })
    .reduce((acc, c) => {
      const lastVote = acc[acc.length - 1]
      const lastPower = lastVote ? lastVote[1] : 0
      const vote: [number, number] = [c[0], c[1] + lastPower]

      return acc.concat([vote])
    }, [] as Array<[number, number]>)
    .map(([timestamp, aggregatedPower]) => {
      return { x: timestamp, y: aggregatedPower }
    })
}

const timestampToFormatted = (timestamp: number) => {
  return format(fromUnixTime(timestamp), 'MMM do HH:mm')
}

const powerToFormatted = (power: number) => {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' })
  return formatter.format(power)
}

export default Chart
