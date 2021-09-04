import React from 'react'
import { useProtocolProposalsQuery } from '../queries'
import { Divider, Flex, Link, ListItem, OrderedList, Spinner, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

interface ProtocolProposalsProps {
  cname: string
}

const ProtocolProposals: React.VFC<ProtocolProposalsProps> = ({ cname }) => {
  const proposals = useProtocolProposalsQuery(cname)

  return (
    <>
      {proposals.isLoading ? (
        <Spinner />
      ) : proposals.isSuccess && proposals.data?.length === 0 ? (
        <Text paddingY={1} alignItems="center" fontSize="medium" ml="2">
          No proposals...
        </Text>
      ) : proposals.isSuccess && proposals.data ? (
        <OrderedList>
          {proposals.data.map((proposal) => (
            <ListItem key={`${proposal.id} ${proposal.title}`} marginLeft={5}>
              <Flex paddingY={3} alignItems="center" fontSize="medium" ml="2">
                <Link
                  as={RouterLink}
                  to={`/protocol/${proposal.protocol}/proposal/${proposal.refId}`}
                >
                  {proposal.title}
                </Link>
              </Flex>

              <Divider borderColor="rgba(89, 87, 116, 0.5)" height="1px" />
            </ListItem>
          ))}
        </OrderedList>
      ) : proposals.isError ? (
        <>(protocols.error as string)</>
      ) : null}
    </>
  )
}

export default ProtocolProposals
