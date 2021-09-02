import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Box, Flex, Heading } from '@chakra-ui/react'

import ProtocolNav from './components/ProtocolNav'
import Chart from './components/Chart'

const App = () => {
  return (
    <Flex width="100%" height="100vh" overflow="hidden">
      <Box width={1 / 3} maxW="300px">
        <Heading px={5} my={3} fontSize="18" position="sticky">
          Welcome to Hawkey
        </Heading>
        <Box overflow="scroll" maxHeight="100%">
          <ProtocolNav />
        </Box>
      </Box>

      <Box flexGrow={1}>
        <Switch>
          <Route path="/protocol/:protocol/proposal/:ref_id" component={Chart} />
          <Route render={() => 'use the navigation on your left...'} />
        </Switch>
      </Box>
    </Flex>
  )
}

export default App
