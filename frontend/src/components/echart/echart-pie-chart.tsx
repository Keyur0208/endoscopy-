import ReactECharts from 'echarts-for-react';

import { Box, useTheme } from '@mui/material';

import { EchartColor } from './echart-style';

interface EChartProps {
  data: number[];
  labels: string[];
  title?: string;
  option?: any;
  colors?: string[];
  tooltipFormatter?: string;
  totalValue?: number;
}

export default function PieEChart({
  data,
  labels,
  title,
  option = {},
  colors,
  tooltipFormatter,
  totalValue,
}: EChartProps) {
  const theme = useTheme();

  const palette = colors && colors.length > 0 ? colors : EchartColor;

  // ---------- NEW: Total Calculation ----------
  const total = data.reduce((sum, val) => sum + val, 0);
  const baseOption: any = {
    color: palette,
    selectedMode: 'single',
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
      formatter: tooltipFormatter || '{b}: {c} ({d}%)',
      trigger: 'item',
      backgroundColor: theme.palette.grey[100],
      textStyle: { color: theme.palette.primary.dark },
    },
    legend: {
      show: false,
    },
  };

  const series = {
    name: title || 'Pie',
    type: 'pie',
    radius: ['0%', '65%'],
    data: labels.map((label, idx) => ({
      value: data[idx],
      name: label,
      itemStyle: { color: palette[idx % palette.length] },
    })),
    label: {
      show: true,
      formatter: '{b}: {c}',
      fontFamily: theme.typography.fontFamily,
      fontSize: 13,
      color: theme.palette.primary.main,
    },
  };

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
      {/* Chart */}
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
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 1,
                mt: 1,
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
