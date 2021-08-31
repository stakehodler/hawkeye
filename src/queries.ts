import { useQuery } from 'react-query'

import { getProtocolProposals, getProtocols, getProtocolVotes } from './api'

const useProtocolsQuery = () => {
  return useQuery(['getProtocols'], () => getProtocols(), {
    select: (data) => data.data.data,
  })
}

const useProtocolProposalsQuery = (cname: string) => {
  return useQuery(['getProtocolProposals', cname], () => getProtocolProposals(cname), {
    select: (data) => data.data.data,
  })
}

const useProposalVotesQuery = (refId?: string) => {
  return useQuery(['getProposalVotes', refId], () => getProtocolVotes(refId!), {
    select: (data) => data.data.data,
    enabled: !!refId,
  })
}

export { useProtocolsQuery, useProtocolProposalsQuery, useProposalVotesQuery }
