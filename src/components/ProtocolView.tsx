import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Text,
  Spinner,
  Flex,
  AbsoluteCenter,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  Button,
  Collapse,
  Center,
} from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'

import { LegendOrdinal } from '@visx/legend'
import { scaleOrdinal } from '@visx/scale'

import { useProposalQuery, useProposalVotesQuery, useProtocolDetailsQuery } from '../queries'
import VoteChart from './VoteChart'
import ProtocolIcon from './ProtocolIcon'

interface ChartProps {
  counter?: number
}

interface ChartParams {
  protocol: string
  ref_id: string
}

const ProtocolView: React.VFC<ChartProps> = (props) => {
  const { protocol: protocolCName, ref_id: refId } = useParams<ChartParams>()

  const protocol = useProtocolDetailsQuery(protocolCName)
  const proposal = useProposalQuery(refId)
  const votes = useProposalVotesQuery(proposal.data?.refId)

  const [isExpanded, setExpanded] = useState(false)

  const handleToggle = () => setExpanded(!isExpanded)

  if (!proposal || votes.isError || !votes.data) return null

  const ordinalColorScale = scaleOrdinal({
    domain: ['Yay', 'Nay'],
    range: ['#25C9A1', '#F44061'],
  })

  return protocol.isLoading || proposal.isLoading || !protocol?.data || !proposal?.data ? (
    <AbsoluteCenter>
      <Spinner />
    </AbsoluteCenter>
  ) : (
    <Box width="100%">
      <Box color="#19153f" background="#dddcea" fontSize="16" fontWeight="600" padding={4}>
        <Flex alignItems="center">
          <ProtocolIcon protocol={protocol.data} />

          <Text as="span" textTransform="capitalize">
            {protocol.data.name}
          </Text>
        </Flex>

        <Text>{proposal.data.title}</Text>
      </Box>

      <Box
        backgroundColor="#F7FAFC"
        margin={8}
        boxShadow="xl"
        p="4"
        rounded="md"
        bg="white"
        textColor="#aeadbc"
      >
        <Flex alignItems="center" justifyContent="space-between" paddingY="6" paddingX="12">
          <Text color="#0E103B" fontSize="24" fontWeight="bold">
            Voting Timeline
          </Text>
          <Text as="span" textTransform="capitalize">
            {proposal.data.currentState}
          </Text>

          <Box flexGrow={1} />

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

        <VoteChart
          votes={votes.data}
          startDate={proposal.data.startTimestamp!}
          endDate={proposal.data.endTimestamp!}
        />
      </Box>
      <Box
        backgroundColor="#F7FAFC"
        margin={8}
        padding={4}
        boxShadow="xl"
        rounded="md"
        bg="white"
        overflow="hidden"
      >
        <Collapse startingHeight={200} in={isExpanded}>
          <Box>
            {proposal.data.content ? (
              <Box marginTop="6">
                <ReactMarkdown components={ChakraUIRenderer()}>
                  {proposal.data.content}
                </ReactMarkdown>
              </Box>
            ) : null}
          </Box>
        </Collapse>
        <Center>
          <Button size="sm" onClick={handleToggle} mt="1rem">
            Show {isExpanded ? 'Less' : 'More'}
          </Button>
        </Center>
      </Box>
    </Box>
  )
}

export default ProtocolView
