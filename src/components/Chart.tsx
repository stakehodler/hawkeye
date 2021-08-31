import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Spinner } from '@chakra-ui/react'
import { useProposalVotesQuery, useProtocolProposalsQuery } from '../queries'
import { components } from '../types/schema/swagger'
import fromUnixTime from 'date-fns/fromUnixTime'

interface ChartProps {
  counter?: number
}

interface ChartParams {
  protocol: string
  ref_id: string
}

const getChartData = (votes: components['schemas']['Vote'][]) => {
  return votes
    ?.reduce((acc, c) => {
      const lastVote = acc[acc.length - 1]
      const lastPower = lastVote ? lastVote[1] : 0
      const vote: [number, number] = [c.timestamp!, (c.power || 0) + lastPower]

      return acc.concat([vote])
    }, [] as Array<[number, number]>)
    .map(([timestamp, aggregatedPower]) => {
      return [fromUnixTime(timestamp), aggregatedPower]
    })
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

export default Chart
