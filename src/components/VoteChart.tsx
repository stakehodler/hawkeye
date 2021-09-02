import {
  Annotation,
  AnnotationLabel,
  Axis,
  Grid,
  LineSeries,
  Tooltip,
  XYChart,
} from '@visx/xychart'
import { Box, Stack } from '@chakra-ui/react'
import React from 'react'

import { components } from '../types/schema/swagger'
import { format } from 'date-fns'

interface VoteChartProps {
  votes: components['schemas']['Vote'][]
  startDate: number
  endDate: number
}

const VoteChart: React.VFC<VoteChartProps> = ({ votes, startDate, endDate }) => {
  const nayVotes = votes.filter((vote) => vote.choice === 0)
  const yayVotes = votes.filter((vote) => vote.choice === 1)

  const nayData = getChartData(nayVotes, startDate)
  const yayData = getChartData(yayVotes, startDate)

  const dateRange = nayData.concat(yayData).map((data) => data.x)
  const voteRange = nayData.concat(yayData).map((data) => data.y)

  const quorumNeeded = Math.max(...voteRange) / 2

  const quorumData = [
    { x: Math.min(...dateRange), y: quorumNeeded },
    { x: Math.max(...dateRange), y: quorumNeeded },
  ]

  return (
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
      <Tooltip<typeof yayData[0]>
        snapTooltipToDatumX
        snapTooltipToDatumY
        showSeriesGlyphs
        renderTooltip={({ tooltipData, colorScale }) =>
          tooltipData &&
          tooltipData.nearestDatum &&
          tooltipData.nearestDatum.key !== 'Quorum' &&
          tooltipData.nearestDatum.datum.address ? (
            <Stack padding={2} spacing={1}>
              <Box>Address: {tooltipData.nearestDatum.datum.address}</Box>
              <Box>Vote: {tooltipData.nearestDatum.key}</Box>
              <Box>Power: {tooltipData.nearestDatum.datum.y}</Box>
              <Box>Time: {timestampToFormatted(new Date(tooltipData.nearestDatum.datum.x!))}</Box>
            </Stack>
          ) : null
        }
      />
    </XYChart>
  )
}

const getChartData = (votes: components['schemas']['Vote'][], startDate: number) => {
  const data = votes
    .map((vote) => {
      return [vote.timestamp!, vote.power!, vote.address!]
    })
    .sort((a, b) => {
      return (a[0] as number) - (b[0] as number)
    })
    .reduce((acc, c) => {
      const lastVote = acc[acc.length - 1]
      const lastPower = lastVote ? lastVote[1] : 0
      const vote: [number, number, string] = [
        c[0] as number,
        (c[1] as number) + lastPower,
        c[2] as string,
      ]

      return acc.concat([vote])
    }, [] as Array<[number, number, string]>)
    .map(([timestamp, aggregatedPower, address]) => {
      return { x: timestamp, y: aggregatedPower, address: address }
    })

  return [{ x: startDate, y: 0, address: '' }].concat(data)
}

const timestampToFormatted = (date: Date) => {
  return format(date, 'MMM do HH:mm')
}

const powerToFormatted = (power: number) => {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' })
  return formatter.format(power)
}

export default VoteChart
