import React from 'react'
import {
  AbsoluteCenter,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Spinner,
} from '@chakra-ui/react'
import ProtocolProposals from './ProtocolProposals'

import { useProtocolsQuery } from '../queries'

const ProtocolNav = () => {
  const protocols = useProtocolsQuery()

  return protocols.isLoading ? (
    <AbsoluteCenter>
      <Spinner />
    </AbsoluteCenter>
  ) : protocols.isSuccess && protocols.data ? (
    <Accordion allowToggle borderColor="rgba(89, 87, 116, 0.5)" borderLeft={0} borderRight={0}>
      {protocols.data.map((protocol) => (
        <AccordionItem key={protocol.cname}>
          <AccordionButton>
            <Avatar src={protocol.icons?.[0]?.url} size="sm" marginRight="3" />
            <Box flex="1" textAlign="left" fontWeight="semibold" paddingY="3">
              {protocol.name}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <ProtocolProposals cname={protocol.cname!} />
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  ) : protocols.isError ? (
    <>(protocols.error as string)</>
  ) : null
}

export default ProtocolNav
