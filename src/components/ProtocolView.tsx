import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Text,
  Spinner,
  Flex,
  AbsoluteCenter,
  Button,
  Collapse,
  Center,
  List,
  Link,
  Badge,
} from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'

import { LegendOrdinal } from '@visx/legend'
import { scaleOrdinal } from '@visx/scale'

import { useProposalQuery, useProposalVotesQuery, useProtocolDetailsQuery } from '../queries'
import VoteChart from './VoteChart'
import ProtocolIcon from './ProtocolIcon'
import VoterListItem from './VoterView'
import addressPrettier from '../AddressPrettier'

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

  const [isExpandedList, setListExpanded] = useState(false)

  const handleListToggle = () => setListExpanded(!isExpandedList)

  if (proposal.isLoading || votes.isError || !proposal.data || !votes.data) return null

  const colorsList = ['#1698EA', '#5F69EA', '#9F5EDE', '#D853AC', '#DB682D', '#BF8124', '#A28E2B']

  const choiceColors = proposal?.data?.choices?.map((item, index) => {
    const choice: string = item?.toString()?.toLowerCase()
    if (choice === 'yae' || choice === 'yey' || choice === 'yes') {
      return '#54A262'
    } else if (choice === 'nay' || choice === 'nae' || choice === 'no') {
      return '#D55D71'
    } else {
      return colorsList[index % colorsList.length]
    }
  })
  console.log(votes)
  const scaleConfig = {
    domain: proposal?.data?.choices,
    range: choiceColors,
  }

  const ordinalColorScale = scaleOrdinal(scaleConfig)

  return protocol.isLoading || proposal.isLoading || !protocol?.data || !proposal?.data ? (
    <AbsoluteCenter>
      <Spinner />
    </AbsoluteCenter>
  ) : (
    <Box width="100%">
      <Box color="#19153f" background="#dddcea" fontSize="16" fontWeight="600" padding={4}>
        <Flex alignItems="center" paddingY={2}>
          <ProtocolIcon protocol={protocol.data} />
          <Text as="span" fontSize="24" textTransform="capitalize">
            {protocol.data.name}
          </Text>
        </Flex>

        <Text>{proposal.data.title}</Text>
        <Text>
          proposer:{' '}
          <Link href={'https://app.boardroom.info/voter/' + proposal.data.proposer} target="_blank">
            {addressPrettier(proposal.data.proposer)}
          </Link>
        </Text>
      </Box>

      <Flex marginX={8} marginY={4} alignItems={'center'}>
        <Text color="#0E103B" fontSize="24" fontWeight="bold">
          Voting Timeline
        </Text>
        <Box marginX={2}>
          <Badge>{proposal.data.currentState}</Badge>
        </Box>
      </Flex>
      <Box
        backgroundColor="#F7FAFC"
        marginX={8}
        marginBottom={8}
        boxShadow="xl"
        p="4"
        rounded="md"
        bg="white"
        textColor="#aeadbc"
      >
        <Flex alignItems="center" justifyContent="space-between" paddingY="6" paddingX="12">
          <Box flexGrow={1} />
          <Box overflow="hidden">
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
          </Box>
        </Flex>

        <VoteChart
          votes={votes.data}
          choices={proposal.data!.choices!}
          choiceColors={choiceColors!}
          startDate={proposal.data.startTimestamp!}
          endDate={proposal.data.endTimestamp!}
        />
      </Box>

      <Flex marginX={8} marginY={4} alignItems={'center'}>
        <Text color="#0E103B" fontSize="18" fontWeight="bold">
          Votes
        </Text>
        <Box marginX={2}>
          <Badge>{votes.data.length}</Badge>
        </Box>
      </Flex>
      <Box
        backgroundColor="#F7FAFC"
        marginX={8}
        padding={4}
        marginBottom={4}
        boxShadow="xl"
        rounded="md"
        bg="white"
        overflow="hidden"
      >
        <Collapse
          startingHeight={votes?.data?.length > 4 ? 48 * 4 + 10 : 48 * votes?.data?.length + 10}
          in={isExpandedList}
        >
          <List>
            {votes.data
              .sort((a, b) => {
                return (b.timestamp as number) - (a.timestamp as number)
              })
              .map((item) => {
                return (
                  <VoterListItem
                    colors={choiceColors!}
                    vote={item}
                    choices={proposal?.data?.choices!}
                  />
                )
              })}
          </List>
        </Collapse>

        <Center>
          <Button size="sm" onClick={handleListToggle} mt="1rem">
            Show {isExpandedList ? 'Less' : 'More'}
          </Button>
        </Center>
      </Box>

      <Text marginX={8} marginY={4} color="#0E103B" fontSize="18" fontWeight="bold">
        Description
      </Text>
      <Box
        backgroundColor="#F7FAFC"
        marginX={8}
        marginBottom={12}
        padding={4}
        boxShadow="xl"
        rounded="md"
        bg="white"
        overflow="hidden"
      >
        {proposal.data.content ? (
          <Box>
            <ReactMarkdown components={ChakraUIRenderer()}>{proposal.data.content}</ReactMarkdown>
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}

export default ProtocolView
