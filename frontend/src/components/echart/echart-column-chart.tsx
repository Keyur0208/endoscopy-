import ReactECharts from 'echarts-for-react';

import { Box, useTheme } from '@mui/material';

import { EchartColor } from './echart-style';

interface EChartProps {
  data: number[];
  labels: string[];
  title?: string;
  option?: any;
  orient?: 'vertical' | 'horizontal';
  colors?: string[];
  totalValue?: number;
}

export default function ColumnEChart({
  data,
  labels,
  title,
  option = {},
  orient = 'vertical',
  colors,
  totalValue,
}: EChartProps) {
  const theme = useTheme();
  const palette = colors && colors.length > 0 ? colors : EchartColor;
  const total = data.reduce((sum, val) => sum + val, 0);
  // Axis and legend setup
  let baseOption: any = {
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
      backgroundColor: theme.palette.grey[100],
      textStyle: { color: theme.palette.primary.dark },
    },
    legend: false,
    grid: { left: '3%', right: '4%', bottom: '8%', containLabel: true },
  };

  let series: any = {};
  if (orient === 'horizontal') {
    // Horizontal bar chart
    baseOption = {
      ...baseOption,
      xAxis: { type: 'value', axisLabel: { fontFamily: theme.typography.fontFamily } },
      yAxis: {
        type: 'category',
        data: labels,
        axisLabel: { fontFamily: theme.typography.fontFamily, interval: 0, rotate: 30 },
        splitLine: {
          show: false,
        },
      },
    };
    series = {
      name: title || 'Bar',
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
      data: data.map((value, idx) => ({
        value,
        itemStyle: colors ? { color: colors[idx] } : undefined,
      })),
      label: {
        show: true,
        position: 'right',
        fontFamily: theme.typography.fontFamily,
        fontSize: 13,
        color: theme.palette.primary.main,
      },
      itemStyle: {
        borderRadius: [0, 0, 0, 0],
      },
    };
  } else {
    // Vertical column chart
    baseOption = {
      ...baseOption,
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: { fontFamily: theme.typography.fontFamily },
      },
      yAxis: { type: 'value', axisLabel: { fontFamily: theme.typography.fontFamily } },
    };
    series = {
      name: title || 'Column',
      type: 'bar',
      data: data.map((value, idx) => ({
        value,
        itemStyle: colors ? { color: colors[idx] } : undefined,
      })),
      label: {
        show: true,
        position: 'top',
        fontFamily: theme.typography.fontFamily,
        fontSize: 13,
        color: theme.palette.primary.main,
      },
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
      },
    };
  }

  const finalOption = {
    ...baseOption,
    series: [series],
    ...option,
  };

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: theme.palette.grey[100],
        borderRadius: 2,
        p: 2,
        boxShadow: 2,
      }}
    >
      <ReactECharts option={finalOption} />
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
              {labels.map((label, i) => {
                const value = data[i];
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
                      {label} = {value}
                    </Box>
                  </Box>
                );
              })}
            </Box>
            <Box
              sx={{
                mt: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <Box sx={{ fontSize: 11, fontWeight: 'bold' }}>
                {' '}
                Total ={totalValue !== undefined ? totalValue : total}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
