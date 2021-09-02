import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Text, Spinner, Flex, AbsoluteCenter } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'

import { LegendOrdinal } from '@visx/legend'
import { scaleOrdinal } from '@visx/scale'

import { useProposalQuery, useProposalVotesQuery } from '../queries'
import VoteChart from './VoteChart'

interface ChartProps {
  counter?: number
}

interface ChartParams {
  protocol: string
  ref_id: string
}

const ProtocolView: React.VFC<ChartProps> = (props) => {
  const { protocol, ref_id: refId } = useParams<ChartParams>()

  const proposal = useProposalQuery(refId)
  const votes = useProposalVotesQuery(proposal.data?.refId)

  if (!proposal || votes.isError || !votes.data) return null

  const ordinalColorScale = scaleOrdinal({
    domain: ['Yay', 'Nay'],
    range: ['#25C9A1', '#F44061'],
  })

  return proposal.isLoading || !proposal?.data ? (
    <AbsoluteCenter>
      <Spinner />
    </AbsoluteCenter>
  ) : (
    <Box width="100%">
      <Box color="#728096" fontSize="16" fontWeight="600">
        <Text>
          Protocol:{' '}
          <Text as="span" textTransform="capitalize">
            {protocol}
          </Text>
        </Text>

        <Text>Proposal: {proposal.data.title}</Text>

        <Text>
          Status:{' '}
          <Text as="span" textTransform="capitalize">
            {proposal.data.currentState}
          </Text>
        </Text>
      </Box>

      <Box backgroundColor="#F7FAFC" marginTop="6">
        <Flex alignItems="center" justifyContent="space-between" paddingY="6" paddingX="12">
          <Text color="#0E103B" fontSize="24" fontWeight="bold">
            Voting Timeline
          </Text>

          <LegendOrdinal
            scale={ordinalColorScale}
            direction="row"
            itemDirection="row"
            labelMargin="0 0 0 10px"
            shapeMargin="0 0 0 32px"
            shapeHeight="3px"
            shapeWidth="18px"
            legendLabelProps={{ color: 'red' }}
          />
        </Flex>

        <VoteChart votes={votes.data} />
      </Box>

      {proposal.data.content ? (
        <Box marginTop="6">
          <ReactMarkdown components={ChakraUIRenderer()}>{proposal.data.content}</ReactMarkdown>
        </Box>
      ) : null}
    </Box>
  )
}

export default ProtocolView
