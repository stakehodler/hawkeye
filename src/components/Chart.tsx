import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Spinner } from '@chakra-ui/react'
import { useProposalVotesQuery, useProtocolProposalsQuery } from '../queries'
import { components } from '../types/schema/swagger'
import { format, fromUnixTime } from 'date-fns'

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

  console.log(nayChart, yayChart)

  return proposals.isLoading ? (
    <Spinner />
  ) : (
    <>
      <Box>Protocol: {protocol}</Box>
      <Box>Proposal: {proposal.title}</Box>

      {votes.data.map((vote) => (
        <>{vote.choice}</>
      ))}
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
      return { x: timestampToFormatted(timestamp), y: aggregatedPower }
    })
}

const timestampToFormatted = (timestamp: number) => {
  return format(fromUnixTime(timestamp), 'MMM do HH:mm')
}

export default Chart
