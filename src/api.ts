import axios from 'axios'
import { operations } from './types/schema/swagger'

const BASE_API_URL = 'https://api.boardroom.info/v1/'

const instance = axios.create({
  baseURL: BASE_API_URL,
})

type GetProtocolsResponse =
  operations['getProtocols']['responses']['200']['content']['application/json']
const getProtocols = () => {
  return instance.get<GetProtocolsResponse>('/protocols')
}

type GetProtocolDetailsResponse =
  operations['getProtocolDetails']['responses']['200']['content']['application/json']
const getProtocolDetails = (cname: string) => {
  return instance.get<GetProtocolDetailsResponse>(`/protocols/${cname}`)
}

type GetProtocolProposalsResponse =
  operations['getProtocolProposals']['responses']['200']['content']['application/json']
const getProtocolProposals = (cname: string) => {
  return instance.get<GetProtocolProposalsResponse>(`/protocols/${cname}/proposals`)
}

type GetProposalResponse =
  operations['getProposal']['responses']['200']['content']['application/json']
const getProposal = (refId: string) => {
  return instance.get<GetProposalResponse>(`/proposals/${refId}`)
}

type GetProposalVotesResponse =
  operations['getProposalVotes']['responses']['200']['content']['application/json']
const getProtocolVotes = (refId: string) => {
  return instance.get<GetProposalVotesResponse>(`/proposals/${refId}/votes`)
}

type GetVoterDetailsResponse =
  operations['getVoter']['responses']['200']['content']['application/json']
const getVoterDetails = (address: string) => {
  return instance.get<GetVoterDetailsResponse>(`/voters/${address}`)
}

export {
  getProtocols,
  getProtocolDetails,
  getProtocolProposals,
  getProposal,
  getProtocolVotes,
  getVoterDetails,
}
