import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Text, Spinner, Flex, AbsoluteCenter } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import { format } from 'date-fns'
import { Annotation, AnnotationLabel, Axis, Grid, LineSeries, XYChart } from '@visx/xychart'
import { LegendOrdinal } from '@visx/legend'
import { scaleOrdinal } from '@visx/scale'

import { useProposalQuery, useProposalVotesQuery } from '../queries'
import { components } from '../types/schema/swagger'

interface ChartProps {
  counter?: number
}

interface ChartParams {
  protocol: string
  ref_id: string
}

const ProtocolView: React.VFC<ChartProps> = (props) => {
  const { protocol, ref_id: refId } = useParams<ChartParams>()

  const proposal = useProposalQuery(refId)
  const votes = useProposalVotesQuery(proposal.data?.refId)
  console.log(proposal.data)

  if (!proposal || votes.isError || !votes.data) return null

  const nayVotes = votes.data.filter((vote) => vote.choice === 0)
  const yayVotes = votes.data.filter((vote) => vote.choice === 1)

  const nayData = getChartData(nayVotes)
  const yayData = getChartData(yayVotes)

  const dateRange = nayData.concat(yayData).map((data) => data.x)
  const voteRange = nayData.concat(yayData).map((data) => data.y)

  const quorumNeeded = Math.max(...voteRange) / 2

  const quorumData = [
    { x: Math.min(...dateRange), y: quorumNeeded },
    { x: Math.max(...dateRange), y: quorumNeeded },
  ]

  const ordinalColorScale = scaleOrdinal({
    domain: ['Yay', 'Nay'],
    range: ['#25C9A1', '#F44061'],
  })

  return proposal.isLoading || !proposal?.data ? (
    <AbsoluteCenter>
      <Spinner />
    </AbsoluteCenter>
  ) : (
    <Box width="100%">
      <Box color="#728096" fontSize="16" fontWeight="600">
        <Text>
          Protocol:{' '}
          <Text as="span" textTransform="capitalize">
            {protocol}
          </Text>
        </Text>

        <Text>Proposal: {proposal.data.title}</Text>

        <Text>
          Status:{' '}
          <Text as="span" textTransform="capitalize">
            {proposal.data.currentState}
          </Text>
        </Text>
      </Box>

      <Box backgroundColor="#F7FAFC" marginTop="6">
        <Flex alignItems="center" justifyContent="space-between" paddingY="6" paddingX="12">
          <Text color="#0E103B" fontSize="24" fontWeight="bold">
            Voting Timeline
          </Text>

          <LegendOrdinal
            scale={ordinalColorScale}
            direction="row"
            itemDirection="row"
            labelMargin="0 0 0 10px"
            shapeMargin="0 0 0 32px"
            shapeHeight="3px"
            shapeWidth="18px"
            legendLabelProps={{ color: 'red' }}
          />
        </Flex>

        <XYChart
          height={500}
          margin={{ top: 10, right: 80, bottom: 80, left: 80 }}
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear', nice: true, round: true }}
        >
          <Grid columns={false} numTicks={5} lineStyle={{ stroke: '#EBF0F6' }} />
          <Axis
            orientation="left"
            numTicks={5}
            tickFormat={powerToFormatted}
            hideAxisLine
            hideTicks
            tickLabelProps={() => ({ fill: '#A2ACBA', fontWeight: 'bold' })}
          />
          <Axis
            orientation="bottom"
            numTicks={5}
            tickFormat={timestampToFormatted}
            hideAxisLine
            hideTicks
            tickLabelProps={() => ({
              fill: '#A2ACBA',
              fontWeight: 'bold',
              transform: 'translate(0, 13)',
            })}
          />
          <LineSeries
            dataKey="Nay"
            data={nayData}
            xAccessor={(d) => d?.x}
            yAccessor={(d) => d?.y}
            stroke="#F44061"
          />
          <LineSeries
            dataKey="Yay"
            data={yayData}
            xAccessor={(d) => d?.x}
            yAccessor={(d) => d?.y}
            stroke="#25C9A1"
          />
          <LineSeries
            dataKey="Quorum"
            data={quorumData}
            xAccessor={(d) => d?.x}
            yAccessor={(d) => d?.y}
            stroke="#728096"
            strokeWidth="2"
            strokeDasharray="1 4"
          />
          <Annotation dataKey="Quorum" datum={quorumData[1]}>
            <AnnotationLabel
              title="Quorum Needed"
              showAnchorLine={false}
              backgroundFill="transparent"
              verticalAnchor="start"
              width={110}
              titleProps={{ fill: '#728096' }}
            />
          </Annotation>
        </XYChart>
      </Box>

      {proposal.data.content ? (
        <Box marginTop="6">
          <ReactMarkdown components={ChakraUIRenderer()}>{proposal.data.content}</ReactMarkdown>
        </Box>
      ) : null}
    </Box>
  )
}

const getChartData = (votes: components['schemas']['Vote'][]) => {
  return votes
    .map((vote) => {
      return [vote.timestamp!, vote.power!]
    })
    .sort((a, b) => {
      return a[0] - b[0]
    })
    .reduce((acc, c) => {
      const lastVote = acc[acc.length - 1]
      const lastPower = lastVote ? lastVote[1] : 0
      const vote: [number, number] = [c[0], c[1] + lastPower]

      return acc.concat([vote])
    }, [] as Array<[number, number]>)
    .map(([timestamp, aggregatedPower]) => {
      return { x: timestamp, y: aggregatedPower }
    })
}

const timestampToFormatted = (date: Date) => {
  return format(date, 'MMM do HH:mm')
}

const powerToFormatted = (power: number) => {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' })
  return formatter.format(power)
}

export default ProtocolView
