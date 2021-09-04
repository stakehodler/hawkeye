import React from 'react'
import { components } from '../types/schema/swagger'
import { Box, Divider, Flex, ListItem, Text } from '@chakra-ui/react'

interface VoterItemProps {
  vote: components['schemas']['Vote']
  choices: string[]
  colors: string[]
}

const VoterListItem: React.VFC<VoterItemProps> = ({ vote, choices, colors }) => {
  return (
    <ListItem>
      <Flex justify="center" alignItems="center">
        <Box flexGrow={1} paddingY={3} paddingX={1}>
          {vote.address}
        </Box>
        <Box
          width="15%"
          paddingX={4}
          borderLeftColor="rgba(89, 87, 116, 0.1)"
          borderLeftWidth={1}
          fontWeight="600"
          color={colors[vote.choice!]}
        >
          {choices[vote.choice!]}
        </Box>
        <Flex
          width="20%"
          paddingX={1}
          borderLeftColor="rgba(89, 87, 116, 0.1)"
          borderLeftWidth={1}
          color="#0E103B"
          fontWeight="600"
        >
          <Box flexGrow={1} />
          <Text>{vote.power}</Text>
        </Flex>
      </Flex>
      <Divider borderColor="rgba(89, 87, 116, 0.1)" height={1} />
    </ListItem>
  )
}

export default VoterListItem
