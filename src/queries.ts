import { useQuery } from 'react-query'

import { getProposal, getProtocolProposals, getProtocols, getProtocolVotes } from './api'

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

const useProposalQuery = (refId?: string) => {
  return useQuery(['getProposal', refId], () => getProposal(refId!), {
    select: (data) => data.data.data,
    enabled: !!refId,
  })
}

const useProposalVotesQuery = (refId?: string) => {
  return useQuery(['getProposalVotes', refId], () => getProtocolVotes(refId!), {
    select: (data) => data.data.data,
    enabled: !!refId,
  })
}

export { useProtocolsQuery, useProtocolProposalsQuery, useProposalQuery, useProposalVotesQuery }
