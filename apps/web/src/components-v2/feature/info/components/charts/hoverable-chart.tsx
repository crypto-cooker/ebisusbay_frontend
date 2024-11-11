import { Box, Skeleton, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { memo, useEffect, useMemo, useState } from 'react'
import { ProtocolData, TvlChartEntry, VolumeChartEntry } from '@src/components-v2/feature/info/state/types'
import { formatAmount } from '@pancakeswap/utils/formatInfoNumbers'
import BarChart from './bar-chart'
import LineChart from './line-chart'

interface HoverableChartProps {
  volumeChartData: VolumeChartEntry[] | undefined
  protocolData: ProtocolData | undefined
  currentDate: string
  valueProperty: string
  title: string
  ChartComponent: typeof BarChart | typeof LineChart
}

const HoverableChart = ({
  volumeChartData,
  protocolData,
  currentDate,
  valueProperty,
  title,
  ChartComponent,
}: HoverableChartProps) => {
  const [hover, setHover] = useState<number | undefined>()
  const [dateHover, setDateHover] = useState<string | undefined>()

  // Getting latest data to display on top of chart when not hovered
  useEffect(() => {
    setHover(undefined)
  }, [protocolData])

  useEffect(() => {
    console.log(protocolData, "HHHHHHHHHHHH")
    if (typeof hover === 'undefined' && protocolData) {
      setHover(protocolData[valueProperty as keyof typeof protocolData])
    }
  }, [protocolData, hover, valueProperty])

  const formattedData = useMemo(() => {
    if (volumeChartData) {
      return volumeChartData.map((day) => {
        return {
          time: dayjs.unix(day.date).toDate(),
          value: day[valueProperty as keyof typeof protocolData],
        }
      })
    }
    return []
  }, [valueProperty, volumeChartData])

  return (
    <Box>
      <Text fontWeight='bold' color="secondary">
        {title}
      </Text>
      {Number(hover) > -1 ? ( // sometimes data is 0
        <Text fontWeight='bold' fontSize="24px">
          ${formatAmount(hover)}
        </Text>
      ) : (
        <Skeleton width="128px" height="36px" />
      )}
      <Text>{dateHover ?? currentDate}</Text>
      <Box height="250px">
        <ChartComponent data={formattedData} setHoverValue={setHover} setHoverDate={setDateHover} />
      </Box>
    </Box>
  )
}

export default memo(HoverableChart)
