import React from 'react'
import { components } from '../types/schema/swagger'
import { Box, Center, Divider, Flex, Link, ListItem, Tag, Text } from '@chakra-ui/react'
import { useProposalQuery, useVoterDetailsQuery } from '../queries'
import { format } from 'date-fns'

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
        <Box flexGrow={1} paddingY={3} paddingX={1}>
          <Link href={'https://app.boardroom.info/voter/' + vote.address} target="_blank">
            {vote.address?.substr(0, 5)}...
            {vote.address?.substr(vote.address?.length - 4, vote.address?.length)}
          </Link>
        </Box>
        <Box width="25%" paddingX={4} borderLeftColor="rgba(89, 87, 116, 0.1)" borderLeftWidth={1}>
          <Tag backgroundColor={colors[vote.choice!]} color={'white'}>
            <Center>{choices[vote.choice!]}</Center>
          </Tag>
        </Box>
        <Box width="25%" paddingX={4} borderLeftColor="rgba(89, 87, 116, 0.1)" borderLeftWidth={1}>
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
          <Text>{vote.power}</Text>
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
