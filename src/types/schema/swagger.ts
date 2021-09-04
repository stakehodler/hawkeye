/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/protocols': {
    /** Get all protocols of boardroom */
    get: operations['getProtocols']
  }
  '/protocols/{cname}/proposals': {
    /** Get all proposals for a protocol */
    get: operations['getProtocolProposals']
  }
  '/proposals': {
    /** Get proposals across all protocols */
    get: operations['getProposals']
  }
  '/proposals/{refId}/votes': {
    /** Get votes on a proposal */
    get: operations['getProposalVotes']
  }
  '/protocols/{cname}': {
    /** Get a single protocol details */
    get: operations['getProtocolDetails']
  }
  '/proposals/{refId}': {
    /** Get a single proposal */
    get: operations['getProposal']
  }
  '/voters/{address}/votes': {
    /** Get votes by voter */
    get: operations['getVoterVotes']
  }
  '/protocols/{cname}/voters': {
    /** Get all voters for a protocol */
    get: operations['getProtocolVoters']
  }
  '/voters': {
    /** Get voters across all protocols */
    get: operations['getVoters']
  }
  '/voters/{address}': {
    /** Get details for a specific voter */
    get: operations['getVoter']
  }
  '/stats': {
    /** Get global platform stats */
    get: operations['getStats']
  }
}

export interface components {
  schemas: {
    Protocol: {
      icons?: {
        adapter?: string
        size?: string
        url?: string
      }[]
      tokens?: {
        network?: string
        contractAddress?: string
        marketPrices?: {
          currency?: string
          price?: number
        }[]
        adapter?: string
        symbol?: string
      }[]
      cname?: string
      name?: string
      totalProposals?: number
      totalVotes?: number
      uniqueVoters?: number
    }
    Proposal: {
      startTimestamp?: number
      endTimestamp?: number
      title?: string
      content?: string
      protocol?: string
      adapter?: string
      startTime?: {
        blockNumber?: number
      }
      id?: string
      currentState?: string
      results?: {
        total?: number
        choice?: number
      }[]
      choices?: string[] //was{ [key: string]: unknown }[]
      events?: {
        timestamp?: number
        time?: {
          blockNumber?: number
        }
        event?: string
      }[]
      refId?: string
      proposer?: string
      totalVotes?: number
      blockNumber?: number
      endTime?: {
        blockNumber?: number
      }
    }
    Voter: {
      address?: string
      firstVoteCast?: number
      lastVoteCast?: number
      totalVotesCast?: number
      protocols?: {
        lastCastPower?: number
        protocol?: string
        totalVotesCast?: number
        lastVoteCast?: number
        firstVoteCast?: number
        totalPowerCast?: number
      }[]
    }
    Vote: {
      protocol?: string
      proposalInfo?: {
        startTime?: {
          timestamp?: number
        }
        endTime?: {
          timestamp?: number
        }
        title?: string
        choices?: string[]
        currentState?: string
        endTimestamp?: number
        startTimestamp?: number
        events?: string[]
      }
      adapter?: string
      address?: string
      refId?: string
      proposalRefId?: string
      power?: number
      time?: {
        timestamp?: number
      }
      choice?: number
      proposalId?: string
      timestamp?: number
    }
  }
}

export interface operations {
  /** Get all protocols of boardroom */
  getProtocols: {
    responses: {
      /** Response */
      200: {
        content: {
          'application/json': {
            data?: components['schemas']['Protocol'][]
          }
        }
      }
    }
  }
  /** Get all proposals for a protocol */
  getProtocolProposals: {
    parameters: {
      path: {
        /** Protocol cname. */
        cname: string
      }
    }
    responses: {
      /** Response */
      200: {
        content: {
          'application/json': {
            data?: components['schemas']['Proposal'][]
            nextCursor?: string
          }
        }
      }
    }
  }
  /** Get proposals across all protocols */
  getProposals: {
    responses: {
      /** Response */
      200: {
        content: {
          'application/json': {
            data?: components['schemas']['Proposal'][]
            nextCursor?: string
          }
        }
      }
    }
  }
  /** Get votes on a proposal */
  getProposalVotes: {
    parameters: {
      path: {
        /** Proposal refId. */
        refId: string
      }
    }
    responses: {
      /** Response */
      200: {
        content: {
          'application/json': {
            data?: components['schemas']['Vote'][]
            nextCursor?: string
          }
        }
      }
    }
  }
  /** Get a single protocol details */
  getProtocolDetails: {
    parameters: {
      path: {
        /** Protocol cname. */
        cname: string
      }
    }
    responses: {
      /** Response */
      200: {
        content: {
          'application/json': {
            data?: components['schemas']['Protocol']
          }
        }
      }
    }
  }
  /** Get a single proposal */
  getProposal: {
    parameters: {
      path: {
        /** Proposal refId. */
        refId: string
      }
    }
    responses: {
      /** Response */
      200: {
        content: {
          'application/json': {
            data?: components['schemas']['Proposal']
          }
        }
      }
    }
  }
  /** Get votes by voter */
  getVoterVotes: {
    parameters: {
      path: {
        /** Voter address. */
        address: string
      }
    }
    responses: {
      /** Response */
      200: {
        content: {
          'application/json': {
            data?: components['schemas']['Vote'][]
          }
        }
      }
    }
  }
  /** Get all voters for a protocol */
  getProtocolVoters: {
    parameters: {
      path: {
        /** Protocol cname. */
        cname: string
      }
    }
    responses: {
      /** Response */
      200: {
        content: {
          'application/json': {
            data?: components['schemas']['Voter'][]
            nextCursor?: string
          }
        }
      }
    }
  }
  /** Get voters across all protocols */
  getVoters: {
    responses: {
      /** Response */
      200: {
        content: {
          'application/json': {
            data?: components['schemas']['Voter'][]
            nextCursor?: string
          }
        }
      }
    }
  }
  /** Get details for a specific voter */
  getVoter: {
    parameters: {
      path: {
        /** Voter address. */
        address: string
      }
    }
    responses: {
      /** Auto generated using Swagger Inspector */
      200: {
        content: {
          'application/json': {
            data?: components['schemas']['Voter']
          }
        }
      }
    }
  }
  /** Get global platform stats */
  getStats: {
    responses: {
      /** Response */
      200: {
        content: {
          'application/json': {
            data?: {
              totalProposals?: number
              totalVotesCast?: number
              totalUniqueVoters?: number
              totalProtocols?: number
            }
          }
        }
      }
    }
  }
}

export interface external {}
