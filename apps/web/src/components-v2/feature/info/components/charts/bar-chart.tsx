import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { formatAmount } from '@pancakeswap/utils/formatInfoNumbers'
import { BarChartLoader } from './chart-loaders'
import { createChart, IChartApi } from 'lightweight-charts'
import { useUserTheme } from '@src/components-v2/useUser'
import moment from 'moment';

export type LineChartProps = {
  data: any[]
  height?: string
  chartHeight?: string
  setHoverValue: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setHoverDate: Dispatch<SetStateAction<string | undefined>> // used for label of value
} & React.HTMLAttributes<HTMLDivElement>

const Chart = ({ data, setHoverValue, setHoverDate }: LineChartProps) => {
  const theme = useUserTheme()
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartCreated, setChart] = useState<IChartApi | undefined>()

  const transformedData = useMemo(() => {
    if (data) {
      return data.map(({ time, value }) => {
        return {
          time: time.getTime(),
          value,
        }
      })
    }
    return []
  }, [data])

  useEffect(() => {
    if (!chartRef?.current || !transformedData || transformedData.length === 0) return

    const chart = createChart(chartRef?.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: theme.colors.textColor2,
      },
      autoSize: true,
      handleScale: false,
      handleScroll: false,
      rightPriceScale: {
        scaleMargins: {
          top: 0.01,
          bottom: 0,
        },
        borderVisible: false,
      },
      timeScale: {
        visible: true,
        borderVisible: false,
        secondsVisible: false,
        tickMarkFormatter: (unixTime: number) => {
          return moment.unix(unixTime).format('MM')
        },
      },
      grid: {
        horzLines: {
          visible: false,
        },
        vertLines: {
          visible: false,
        },
      },
      crosshair: {
        horzLine: {
          visible: true,
          labelVisible: true,
        },
        mode: 1,
        vertLine: {
          visible: true,
          labelVisible: false,
          style: 3,
          width: 1,
          color: theme.colors.textColor2,
        },
      },
    })

    chart.applyOptions({
      localization: {
        priceFormatter: (priceValue: number | undefined) => formatAmount(priceValue),
      },
    })

    const newSeries = chart.addHistogramSeries({
      color: theme.colors.borderColor3,
    })
    setChart(chart)
    newSeries.setData(transformedData)

    chart.timeScale().fitContent()

    chart.subscribeCrosshairMove((param) => {
      if (newSeries && param) {
        const timestamp = param.time as number
        if (!timestamp) return
        const now = new Date(timestamp)
        const time = `${now.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'UTC',
        })} (UTC)`
        // @ts-ignore
        const parsed = (param.seriesData.get(newSeries)?.value ?? 0) as number | undefined
        if (setHoverValue) setHoverValue(parsed)
        if (setHoverDate) setHoverDate(time)
      } else {
        if (setHoverValue) setHoverValue(undefined)
        if (setHoverDate) setHoverDate(undefined)
      }
    })

    // eslint-disable-next-line consistent-return
    return () => {
      chart.remove()
    }
  }, [theme, transformedData, setHoverValue, setHoverDate])

  return (
    <>
      {!chartCreated && <BarChartLoader />}
      <div style={{ display: 'flex', flex: 1, height: '100%' }}>
        <div style={{ flex: 1, maxWidth: '100%' }} ref={chartRef} />
      </div>
    </>
  )
}

export default Chart
