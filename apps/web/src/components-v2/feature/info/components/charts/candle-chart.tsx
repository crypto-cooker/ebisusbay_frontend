import { useUserTheme } from '@src/components-v2/useUser'
import { CandleChartLoader } from './chart-loaders'
import dayjs from 'dayjs'
import { ColorType, IChartApi, createChart } from 'lightweight-charts'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { baseColors, lightColors, darkColors } from '../../state/colors'

const CANDLE_CHART_HEIGHT = 250

export type LineChartProps = {
  data: any[] | undefined
  setValue?: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setLabel?: Dispatch<SetStateAction<string | undefined>> // used for value label on hover
} & React.HTMLAttributes<HTMLDivElement>

const CandleChart = ({ data, setValue, setLabel }: LineChartProps) => {
  const theme = useUserTheme()
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartCreated, setChart] = useState<IChartApi | undefined>()

  // if chart not instantiated in canvas, create it
  useEffect(() => {
    if (!chartRef.current || !data) return
    const chart = createChart(chartRef.current, {
      autoSize: true,
      // height: CANDLE_CHART_HEIGHT,
      // width: chartRef.current.parentElement.clientWidth - 32,
      layout: {
        background: {
          type: ColorType.Solid,
          color: 'transparent',
        },
        textColor: theme.colors.textColor2,
        fontFamily: 'Kanit, sans-serif',
        fontSize: 12,
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        secondsVisible: true,
        tickMarkFormatter: (unixTime: number) => {
          return dayjs.unix(unixTime).format('MM/DD h:mm a')
        },
      },
      watermark: {
        visible: false,
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
          visible: false,
          labelVisible: false,
        },
        mode: 1,
        vertLine: {
          visible: true,
          labelVisible: false,
          style: 3,
          width: 1,
          color: theme.colors.textColor2,
          labelBackgroundColor: theme.colors.bgColor2,
        },
      },
    })

    chart.timeScale().fitContent()
    setChart(chart)
    // if (!chartCreated && data && !!chartRef?.current?.parentElement) {
    // }

    const series = chart.addCandlestickSeries({
      upColor: baseColors.success,
      downColor: baseColors.failure,
      borderDownColor: baseColors.failure,
      borderUpColor: baseColors.success,
      wickDownColor: baseColors.failure,
      wickUpColor: baseColors.success,
    })

    series.setData(data)

    chart.applyOptions({
      layout: {
        textColor: theme.colors.textColor2,
      },
    })

    // update the title when hovering on the chart
    chart.subscribeCrosshairMove((param) => {
      if (
        chartRef?.current &&
        (param === undefined ||
          param.time === undefined ||
          (param && param.point && param.point.x < 0) ||
          (param && param.point && param.point.x > chartRef.current.clientWidth) ||
          (param && param.point && param.point.y < 0) ||
          (param && param.point && param.point.y > CANDLE_CHART_HEIGHT))
      ) {
        // reset values
        if (setValue) setValue(undefined)
        if (setLabel) setLabel(undefined)
      } else if (series && param) {
        const timestamp = param.time as number
        const now = new Date(timestamp * 1000)
        const time = `${now.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'UTC',
        })} (UTC)`
        const parsed = param.seriesData.get(series) as { open: number } | undefined
        if (setValue) setValue(parsed?.open)
        if (setLabel) setLabel(time)
      }
    })

    // eslint-disable-next-line consistent-return
    return () => {
      if (chart) {
        chart.remove()
        setChart(undefined)
      }
    }
  }, [data, setLabel, setValue, theme])

  return (
    <>
      {!chartCreated && <CandleChartLoader />}
      <div style={{ display: 'flex', flex: 1, height: '100%' }}>
        <div style={{ flex: 1, maxWidth: '100%' }} ref={chartRef} />
      </div>
    </>
  )
}

export default CandleChart
