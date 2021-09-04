import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Box, Flex, Heading } from '@chakra-ui/react'

import ProtocolNav from './components/ProtocolNav'
import ProtocolView from './components/ProtocolView'

const App = () => {
  return (
    <Flex width="100%" height="100vh" overflow="hidden" background="#fbfbfe">
      <Box width="500px" boxShadow="xl" p="4" roundedTopRight="lg" bg="#19153F" textColor="#aeadbc">
        <Heading px={5} my={3} fontSize="18" position="sticky">
          Welcome to Hawkey
        </Heading>

        <Box overflow="scroll" maxHeight="100%">
          <ProtocolNav />
        </Box>
      </Box>

      <Box width="100%" minW="800px" overflow="scroll">
        <Switch>
          <Route path="/protocol/:protocol/proposal/:ref_id" component={ProtocolView} />
          <Route render={() => 'use the navigation on your left...'} />
        </Switch>
      </Box>
    </Flex>
  )
}

export default App
