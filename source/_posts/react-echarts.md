---
title: 如何在React项目中使用Echarts
date: 2026-01-01 22:18:34
tags:
- react
- echarts
---

- [echarts官网](https://echarts.apache.org/zh/index.html)

## 安装依赖
```bash
yarn add echarts
```

## 示例
```tsx
import * as echarts from "echarts";
import type { ECharts } from "echarts";
import { memo, useEffect, useRef } from "react";
import { CharBox, Chart } from "./style";

const LineChart = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);

      chartInstance.current.setOption({
        tooltip: {},
        xAxis: {
          data: [
            "2026-01-01",
            "2026-01-02",
            "2026-01-29",
            "2026-01-30",
          ],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "line",
            data: [5, 20, 10, 20],
            smooth: true,
            areaStyle: {
              color: '#f00'
            }
          },
        ],
      });
    }
  }, [chartRef]);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const resize = () => {
    chartInstance.current?.resize({
      animation: { duration: 300 },
    });
  };

  return (
    <CharBox>
      <Chart ref={chartRef} />
    </CharBox>
  );
};

export default memo(LineChart);

```