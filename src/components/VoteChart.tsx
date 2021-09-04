import { Axis, Grid, LineSeries, Tooltip, XYChart } from '@visx/xychart'
import { Box, Center, Flex, Stack, Tag, Text } from '@chakra-ui/react'
import React from 'react'

import { components } from '../types/schema/swagger'
import { format } from 'date-fns'
import addressPrettier from '../AddressPrettier'

interface VoteChartProps {
  votes: components['schemas']['Vote'][]
  startDate: number
  endDate: number
  choices: string[]
  choiceColors: string[]
}

const VoteChart: React.VFC<VoteChartProps> = ({
  votes,
  startDate,
  endDate,
  choices,
  choiceColors,
}) => {
  const votesByChoice = choiceColors.map((value, index) => {
    return votes.filter((vote) => vote.choice === index)
  })

  const chartData = votesByChoice.map((value, index) => {
    return getChartData(value, startDate)
  })

  const chartComponent = chartData.map((value, index) => {
    return (
      <LineSeries
        dataKey={choices[index]}
        data={value}
        xAccessor={(d) => d?.x}
        yAccessor={(d) => d?.y}
        stroke={choiceColors[index]}
      />
    )
  })

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
      <>{chartComponent}</>
      <Tooltip<typeof chartData[0][0]>
        snapTooltipToDatumX
        snapTooltipToDatumY
        showSeriesGlyphs
        renderTooltip={({ tooltipData, colorScale }) =>
          tooltipData &&
          tooltipData.nearestDatum &&
          tooltipData.nearestDatum.key !== 'Quorum' &&
          tooltipData.nearestDatum.datum.address ? (
            <Stack padding={2} spacing={1}>
              <Flex>
                <Tag
                  size={'sm'}
                  backgroundColor={choiceColors[tooltipData.nearestDatum.datum.choice]}
                  color={'white'}
                >
                  <Center>{tooltipData.nearestDatum.key}</Center>
                </Tag>
              </Flex>
              <Flex paddingY={1}>
                <Box minWidth="60px"> Address:</Box>
                {addressPrettier(tooltipData.nearestDatum.datum.address)}
              </Flex>
              <Flex paddingBottom={1}>
                <Box minWidth="60px">Power: </Box>
                {tooltipData.nearestDatum.datum.y}
              </Flex>
              <Flex paddingBottom={2}>
                <Box minWidth="60px">Time:</Box>{' '}
                {timestampToFormatted(new Date(tooltipData.nearestDatum.datum.x!))}
              </Flex>
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
      return [vote.timestamp!, vote.power!, vote.address!, vote!.choice]
    })
    .sort((a, b) => {
      return (a[0] as number) - (b[0] as number)
    })
    .reduce((acc, c) => {
      const lastVote = acc[acc.length - 1]
      const lastPower = lastVote ? lastVote[1] : 0
      const vote: [number, number, string, number] = [
        c[0] as number,
        (c[1] as number) + lastPower,
        c[2] as string,
        c[3] as number,
      ]

      return acc.concat([vote])
    }, [] as Array<[number, number, string, number]>)
    .map(([timestamp, aggregatedPower, address, choice]) => {
      return { x: timestamp, y: aggregatedPower, address: address, choice: choice }
    })

  return [{ x: startDate, y: 0, address: '', choice: 0 }].concat(data)
}

const timestampToFormatted = (date: Date) => {
  return format(date, 'MMM do HH:mm')
}

const powerToFormatted = (power: number) => {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' })
  return formatter.format(power)
}

export default VoteChart
