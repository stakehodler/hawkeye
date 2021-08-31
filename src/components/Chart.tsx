import React from 'react'
import {useParams} from 'react-router-dom'
import {Box} from "@chakra-ui/react";
import {useProposalVotesQuery, useProtocolProposalsQuery} from "../queries";

interface ChartProps {
    counter?: number
}

interface ChartParams {
    protocol: string,
    ref_id: string,
}

const Chart: React.VFC<ChartProps> = (props) => {
    const {protocol, ref_id: refId} = useParams<ChartParams>()

    const proposals = useProtocolProposalsQuery(protocol)
    const proposal = proposals.data?.find(proposal => proposal.refId = refId)
    const votes = useProposalVotesQuery(proposal?.refId)

    const nayVotes = votes.data?.filter(vote => vote.choice === 0)
    const yayVotes = votes.data?.filter(vote => vote.choice === 1)

    const nayChart = nayVotes?.reduce((acc, c) => {
        const lastVote = acc[acc.length - 1]
        const lastPower = lastVote ? lastVote[1] : 0
        const vote: [number, number] = [c.timestamp!, (c.power || 0) + lastPower]

        return acc.concat([vote])
    }, [] as Array<[number, number]>)

    const yayChart = yayVotes?.reduce((acc, c) => {
        const lastVote = acc[acc.length - 1]
        const lastPower = lastVote ? lastVote[1] : 0
        const vote: [number, number] = [c.timestamp!, (c.power || 0) + lastPower]

        return acc.concat([vote])
    }, [] as Array<[number, number]>)

    console.log(nayChart, yayChart)

    return proposal && votes.isSuccess && votes.data ? (
        <>
            <Box>Protocol: {protocol}</Box>
            <Box>Proposal: {proposal.title}</Box>

            {votes.data.map((vote) => (
                <>{vote.choice}</>
            ))}
        </>
    ) : null
}

export default Chart