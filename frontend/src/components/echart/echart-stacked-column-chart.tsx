import ReactECharts from 'echarts-for-react';

import { Box, useTheme } from '@mui/material';

import { EchartColor } from './echart-style';

interface StackedChartProps {
  labels: string[];
  seriesData: {
    name: string;
    data: number[];
  }[];
  title?: string;
  orient?: 'vertical' | 'horizontal';
  colors?: string[];
}

export default function StackedColumnEChart({
  labels,
  seriesData,
  title,
  orient = 'vertical',
  colors,
}: StackedChartProps) {
  const theme = useTheme();

  const palette = colors && colors.length > 0 ? colors : EchartColor;
  const total = seriesData.reduce((sum, series) => sum + series.data.reduce((a, b) => a + b, 0), 0);

  // Axis config based on orientation
  const isHorizontal = orient === 'horizontal';

  const xAxis = isHorizontal
    ? { type: 'value', axisLabel: { fontFamily: theme.typography.fontFamily } }
    : { type: 'category', data: labels, axisLabel: { fontFamily: theme.typography.fontFamily } };
  const yAxis = isHorizontal
    ? { type: 'category', data: labels, axisLabel: { fontFamily: theme.typography.fontFamily } }
    : { type: 'value', axisLabel: { fontFamily: theme.typography.fontFamily } };

  const option = {
    color: palette,

    title: title
      ? {
          text: title,
          left: 'center',
          top: 0,
          textStyle: {
            fontFamily: theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: 18,
            color: theme.palette.primary.dark,
          },
        }
      : undefined,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      show: false,
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis,
    yAxis,
    series: seriesData.map((item, idx) => ({
      name: item.name,
      type: 'bar',
      stack: 'total',
      emphasis: { focus: 'series' },
      data: item.data,
      label: { show: true, position: isHorizontal ? 'right' : 'inside' },
      itemStyle: { borderRadius: 4, color: palette[idx % palette.length] },
    })),
  };

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: theme.palette.grey[50],
        borderRadius: 2,
        p: 2,
        boxShadow: 2,
      }}
    >
      <ReactECharts option={option} />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box width="auto">
          <Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {seriesData.map((series, i) => {
                const value = series.data.reduce((a, b) => a + b, 0);

                return (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        bgcolor: palette[i % palette.length],
                        borderRadius: 1,
                        mr: 1,
                      }}
                    />
                    <Box sx={{ flexGrow: 1, fontSize: 10 }}>
                      {series.name} = {value}
                    </Box>
                  </Box>
                );
              })}
            </Box>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 1,
                mt: 1,
              }}
            >
              <Box sx={{ fontSize: 11, fontWeight: 'bold' }}> Total = {total}</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
