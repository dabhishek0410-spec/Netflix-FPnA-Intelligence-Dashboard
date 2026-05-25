"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { RegionalSplit } from "@/types/regions";

interface RegionalHeatmapProps {
  currentData: RegionalSplit;
  priorData: RegionalSplit;
}

export default function RegionalHeatmap({ currentData, priorData }: RegionalHeatmapProps) {
  const regions: ("UCAN" | "EMEA" | "LATAM" | "APAC")[] = ["UCAN", "EMEA", "LATAM", "APAC"];

  const option = useMemo(() => {
    // Calculate YoY growths for Heatmap
    // X-axis: Regions (UCAN, EMEA, LATAM, APAC)
    // Y-axis: Metrics (Memberships, Revenue, ARPU)
    // Data values are percentages
    const data = regions.flatMap((reg, xIndex) => {
      const cur = currentData.regions[reg];
      const prev = priorData.regions[reg];

      const revGrowth = prev.revenue > 0 ? (cur.revenue - prev.revenue) / prev.revenue : 0;
      const memGrowth = prev.paidMemberships > 0 ? (cur.paidMemberships - prev.paidMemberships) / prev.paidMemberships : 0;
      const arpuGrowth = prev.arpu > 0 ? (cur.arpu - prev.arpu) / prev.arpu : 0;

      return [
        [xIndex, 0, Math.round(memGrowth * 1000) / 10], // Memberships Growth
        [xIndex, 1, Math.round(revGrowth * 1000) / 10], // Revenue Growth
        [xIndex, 2, Math.round(arpuGrowth * 1000) / 10], // ARPU Growth
      ];
    });

    return {
      backgroundColor: "rgba(10, 10, 10, 0.96)",
      tooltip: {
        position: "top",
        formatter: (params: any) => {
          const metrics = ["Paid Memberships Growth", "Revenue Growth", "ARPU Growth"];
          const region = regions[params.value[0]];
          const metric = metrics[params.value[1]];
          const val = params.value[2];
          return `
            <div style="background: #141414; border: 1px solid rgba(255,255,255,0.12); padding: 8px 12px; border-radius: 6px; color: #F5F5F1; font-size: 11px;">
              <span style="font-weight: bold; color: #E50914; text-transform: uppercase;">${region}</span><br/>
              <span style="color: #A3A3A3;">${metric}:</span> <span style="font-weight: bold;">${val > 0 ? '+' : ''}${val}%</span>
            </div>
          `;
        },
        padding: 0,
        backgroundColor: "transparent",
        borderWidth: 0,
      },
      grid: {
        top: "10%",
        bottom: "28%",
        left: "18%",
        right: "5%",
      },
      xAxis: {
        type: "category",
        data: ["🇺🇸 UCAN", "🇪🇺 EMEA", "🇧🇷 LATAM", "🇯🇵 APAC"],
        splitArea: {
          show: true,
        },
        axisLabel: {
          color: "#A3A3A3",
          fontWeight: "bold",
          fontSize: 11,
        },
        axisLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.12)",
          },
        },
      },
      yAxis: {
        type: "category",
        data: ["Memberships", "Revenue", "ARPU"],
        splitArea: {
          show: true,
        },
        axisLabel: {
          color: "#A3A3A3",
          fontWeight: "bold",
          fontSize: 11,
        },
        axisLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.12)",
          },
        },
      },
      visualMap: {
        min: -5,
        max: 25,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "4%",
        itemWidth: 14,
        itemHeight: 130,
        text: ["High Growth", "Contraction"],
        textGap: 8,
        textStyle: {
          color: "#A3A3A3",
          fontSize: 10,
          fontWeight: "bold",
        },
        inRange: {
          color: [
            "rgba(178, 7, 16, 0.92)",   // deep crimson for contraction
            "rgba(100, 10, 10, 0.6)",    // dark mid-red for slight negative
            "rgba(30, 30, 30, 0.85)",    // near-black neutral (zero growth)
            "rgba(6, 95, 70, 0.75)",     // muted emerald for moderate growth
            "rgba(16, 185, 129, 0.92)",  // vivid emerald for high growth
          ],
        },
      },
      series: [
        {
          name: "YoY Growth",
          type: "heatmap",
          data: data,
          label: {
            show: true,
            formatter: (params: any) => {
              const val = params.value[2];
              return `${val > 0 ? "+" : ""}${val}%`;
            },
            color: "#FFF",
            fontWeight: "bold",
            fontSize: 11,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  }, [currentData, priorData]);

  return (
    <div className="w-full h-80 relative select-none rounded-lg overflow-hidden" style={{ background: "rgba(10,10,10,0.96)" }}>
      <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
