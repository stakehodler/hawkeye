import React from 'react'
import { components } from '../types/schema/swagger'
import { Box, Center, Divider, Flex, Link, ListItem, Tag, Text } from '@chakra-ui/react'
import { useProposalQuery, useVoterDetailsQuery } from '../queries'
import { format } from 'date-fns'
import addressPrettier from '../AddressPrettier'

interface VoterItemProps {
  vote: components['schemas']['Vote']
  choices: string[]
  colors: string[]
}

const VoterListItem: React.VFC<VoterItemProps> = ({ vote, choices, colors }) => {
  const voterData = useVoterDetailsQuery(vote.address)

  if (voterData.isLoading || voterData.isError) return null

  return (
    <ListItem>
      <Flex justify="center" alignItems="center">
        <Flex flexGrow={1} paddingY={3} paddingX={1} justifyItems="center" alignItems="center">
          <Box width="140px">
            <Link href={'https://app.boardroom.info/voter/' + vote.address} target="_blank">
              {addressPrettier(vote.address)}
            </Link>
          </Box>
          <Tag backgroundColor={colors[vote.choice!]} color="white" size="sm" marginX={3}>
            <Center>{choices[vote.choice!]}</Center>
          </Tag>
        </Flex>

        <Box flexGrow={1} paddingX={4} borderLeftColor="rgba(89, 87, 116, 0.1)" borderLeftWidth={1}>
          <Center>{timestampToFormatted(new Date(vote.timestamp!))}</Center>
        </Box>
        <Box
          width="25%"
          paddingX={1}
          borderLeftColor="rgba(89, 87, 116, 0.1)"
          borderLeftWidth={1}
          color="#0E103B"
          fontWeight="600"
          textAlign="right"
        >
          <Text>
            {vote.power!.toLocaleString(undefined, {
              maximumFractionDigits: 12,
              minimumFractionDigits: 4,
            })}
          </Text>
        </Box>
      </Flex>
      <Divider borderColor="rgba(89, 87, 116, 0.1)" height={1} />
    </ListItem>
  )
}

const timestampToFormatted = (date: Date) => {
  return format(date, 'MMM do HH:mm')
}

export default VoterListItem
