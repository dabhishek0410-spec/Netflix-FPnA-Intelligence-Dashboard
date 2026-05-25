"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { IncomeStatement } from "@/types/financial";
import { formatCurrency } from "@/lib/calculations/formatters";

interface WaterfallBridgeChartProps {
  metrics: IncomeStatement;
}

export default function WaterfallBridgeChart({ metrics }: WaterfallBridgeChartProps) {
  const option = useMemo(() => {
    // We build the waterfall bridge:
    // Revenue (+44,111) -> Cost of Revenues (-24,702) -> Gross Profit (+19,409) -> Marketing (-3,100) -> Tech & Dev (-3,100) -> G&A (-2,400) -> Operating Income (+10,809)
    const items = [
      { name: "Revenue", value: metrics.revenue, type: "total" },
      { name: "Cost of Revenues", value: -metrics.costOfRevenues, type: "step" },
      { name: "Gross Profit", value: metrics.grossProfit, type: "total" },
      { name: "Marketing", value: -metrics.marketing, type: "step" },
      { name: "Technology & Development", value: -metrics.technologyAndDevelopment, type: "step" },
      { name: "General & Administrative Expenses", value: -metrics.generalAndAdministrative, type: "step" },
      { name: "Operating Income", value: metrics.operatingIncome, type: "total" },
    ];

    // Compute base (the transparent placeholder heights for floating effect)
    // and values (the visible height of each bar)
    const base: number[] = [];
    const values: number[] = [];
    
    let currentHeight = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type === "total") {
        base.push(0);
        values.push(item.value);
        currentHeight = item.value;
      } else {
        // Step change (negative)
        const nextHeight = currentHeight + item.value;
        base.push(nextHeight);
        values.push(Math.abs(item.value));
        currentHeight = nextHeight;
      }
    }

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: any) => {
          // Floating placeholder series is index 0, actual bar series is index 1
          const tar = params[1] ? params[1] : params[0];
          const name = tar.name;
          const index = items.findIndex((it) => it.name === name);
          const rawVal = items[index].value;
          const sign = rawVal > 0 && name !== "Revenue" && name !== "Gross Profit" && name !== "Operating Income" ? "+" : "";
          
          return `
            <div style="background: #141414; border: 1px solid rgba(255,255,255,0.12); padding: 8px 12px; border-radius: 6px; color: #F5F5F1; font-size: 11px;">
              <span style="font-weight: bold; color: #E50914; text-transform: uppercase;">${name}</span><br/>
              <span style="color: #A3A3A3;">Impact:</span> <span style="font-weight: bold; color: ${rawVal < 0 ? '#FB7185' : '#34D399'}">${sign}${formatCurrency(rawVal, true)}</span>
            </div>
          `;
        },
        padding: 0,
        backgroundColor: "transparent",
        borderWidth: 0,
      },
      grid: {
        top: "8%",
        bottom: "8%",
        left: "12%",
        right: "5%",
      },
      xAxis: {
        type: "category",
        data: items.map((item) => item.name),
        axisLabel: {
          color: "#A3A3A3",
          fontWeight: "semibold",
          fontSize: 10,
          interval: 0,
          rotate: 15,
        },
        axisLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.12)",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "#A3A3A3",
          fontWeight: "semibold",
          fontSize: 10,
          formatter: (val: number) => `$${(val / 1000).toFixed(0)}B`,
        },
        axisLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.12)",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.05)",
          },
        },
      },
      series: [
        // Helper series to create "floating" bars (transparent placeholder)
        {
          name: "Placeholder",
          type: "bar",
          stack: "Total",
          itemStyle: {
            borderColor: "transparent",
            color: "transparent",
          },
          emphasis: {
            itemStyle: {
              borderColor: "transparent",
              color: "transparent",
            },
          },
          data: base,
        },
        // The actual visible bars
        {
          name: "Segment Value",
          type: "bar",
          stack: "Total",
          label: {
            show: true,
            position: "top",
            color: "#FFF",
            fontSize: 10,
            fontWeight: "bold",
            formatter: (params: any) => {
              const name = params.name;
              const index = items.findIndex((it) => it.name === name);
              const val = items[index].value;
              const sign = val > 0 && name !== "Revenue" && name !== "Gross Profit" && name !== "Operating Income" ? "+" : "";
              return `${sign}${(val / 1000).toFixed(1)}B`;
            },
          },
          itemStyle: {
            color: (params: any) => {
              const name = params.name;
              if (name === "Revenue" || name === "Operating Income" || name === "Gross Profit") {
                return "#E50914"; // Corporate Anchor totals in Netflix Red
              }
              const index = items.findIndex((it) => it.name === name);
              const val = items[index].value;
              return val < 0 ? "#FB7185" : "#34D399"; // Cost outlays in soft red, additions in soft green
            },
            borderRadius: [4, 4, 0, 0],
          },
          data: values,
        },
      ],
    };
  }, [metrics]);

  return (
    <div className="w-full h-80 relative select-none">
      <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
