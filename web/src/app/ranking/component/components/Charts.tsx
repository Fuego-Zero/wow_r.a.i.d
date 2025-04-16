import React, { useMemo } from "react";
import BaseCharts from "./BaseCharts";
import { useAppConfig } from "@/app/player/context/appConfigContext";
import { Col, Flex, Row } from "antd";
import {
  ROLE_CLASSES_COLOR_MAP,
  ROLE_CLASSES_NAME_MAP,
  RoleClasses,
} from "@/app/constant";
import { ECBasicOption } from "echarts/types/dist/shared";
import { getWClColor } from "@/app/utils";
import { WCLRank } from "@/app/player/types";
import { MapValueType } from "@/app/types";

const ROLE_CLASSES: RoleClasses[] = [
  "DK",
  "XD",
  "LR",
  "FS",
  "MS",
  "SM",
  "QS",
  "DZ",
  "SS",
  "ZS",
];

function Charts() {
  const { WCLRanksMap } = useAppConfig();

  const chartOptions1 = useMemo<ECBasicOption>(() => {
    const data = WCLRanksMap.values().reduce(
      (acc, item) => {
        acc[item.classes].set(item.user_name, item);
        return acc;
      },
      {
        DK: new Map(),
        XD: new Map(),
        LR: new Map(),
        FS: new Map(),
        QS: new Map(),
        MS: new Map(),
        DZ: new Map(),
        SM: new Map(),
        SS: new Map(),
        ZS: new Map(),
      }
    );

    const seriesData = ROLE_CLASSES.map((roleClass) => ({
      value: data[roleClass].size,
      itemStyle: {
        color: ROLE_CLASSES_COLOR_MAP[roleClass],
      },
      label: {
        show: true,
        position: "top",
        fontSize: 14,
        color: ROLE_CLASSES_COLOR_MAP[roleClass],
      },
    }));

    return {
      title: {
        text: "职业角色数量",
      },
      tooltip: null,
      xAxis: {
        data: ROLE_CLASSES.map((roleClass) => ({
          value: roleClass,
          textStyle: {
            color: ROLE_CLASSES_COLOR_MAP[roleClass],
          },
        })),
        axisLabel: {
          formatter: function (value: string) {
            return ROLE_CLASSES_NAME_MAP[value as RoleClasses] || value;
          },
        },
      },
      yAxis: {},
      series: [
        {
          name: "数量",
          type: "bar",
          data: seriesData,
        },
      ],
    };
  }, [WCLRanksMap]);

  const chartOptions2 = useMemo<ECBasicOption>(() => {
    const COLOR_RANK = new Map([
      ["#e5cc80", "金色"],
      ["#e268a8", "粉色"],
      ["#ff8000", "橙色"],
      ["#a335ee", "紫色"],
      ["#0070ff", "蓝色"],
      ["#1eff00", "绿色"],
      ["#666666", "灰色"],
    ]);

    const colorRankMap: Record<
      string,
      Array<MapValueType<typeof WCLRanksMap>>
    > = {
      "#e5cc80": [],
      "#e268a8": [],
      "#ff8000": [],
      "#a335ee": [],
      "#0070ff": [],
      "#1eff00": [],
      "#666666": [],
    };

    WCLRanksMap.values().forEach((item) => {
      const color = getWClColor(item.average_rank_percent)!;
      colorRankMap[color].push(item);
    });

    const seriesData = [...COLOR_RANK.keys()]
      .map((color) => ({
        value: colorRankMap[color].length,
        name: COLOR_RANK.get(color)!,
        itemStyle: {
          color: color,
        },
        label: {
          fontSize: 14,
          color: color,
          formatter: "{c}\n{d}%",
        },
      }))
      .filter((item) => item.value > 0);

    return {
      title: {
        text: "职业分数总览",
      },
      series: [
        {
          type: "pie",
          data: seriesData,
          radius: [0, "65%"],
          itemStyle: {
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "#000",
          },
        },
      ],
    };
  }, [WCLRanksMap]);

  const chartOptions3 = useMemo<ECBasicOption>(() => {
    const COLOR_RANK = new Map([
      ["#666666", "灰色"],
      ["#1eff00", "绿色"],
      ["#0070ff", "蓝色"],
      ["#a335ee", "紫色"],
      ["#ff8000", "橙色"],
      ["#e268a8", "粉色"],
      ["#e5cc80", "金色"],
    ]);

    const COLOR_ORDER = [...COLOR_RANK.keys()];

    const roleClassesMap = WCLRanksMap.values().reduce(
      (acc, item) => {
        acc[item.classes].push(item);
        return acc;
      },
      ROLE_CLASSES.reduce((acc, roleClass) => {
        acc[roleClass] = [];
        return acc;
      }, {} as Record<RoleClasses, WCLRank[]>)
    );

    const series = ROLE_CLASSES.map((classes) => {
      const data = roleClassesMap[classes].reduce((prev, item) => {
        const color = getWClColor(item.average_rank_percent)!;
        const index = COLOR_ORDER.indexOf(color);
        prev[index]++;
        return prev;
      }, Array<number>(ROLE_CLASSES.length).fill(0));

      return {
        name: ROLE_CLASSES_NAME_MAP[classes],
        type: "bar",
        stack: "total",
        label: {
          show: true,
          formatter: (row: any) => {
            if (row.data === 0) return "";
            return row.data + "%";
          },
        },
        emphasis: {
          focus: "series",
        },
        itemStyle: {
          color: ROLE_CLASSES_COLOR_MAP[classes],
        },
        data: data,
      };
    });

    const columnTotals = Array(ROLE_CLASSES.length).fill(0);
    series.forEach((rowData) => {
      rowData.data.forEach((value, colIndex) => {
        columnTotals[colIndex] += value;
      });
    });

    const originalDataMap = new Map<string, number[]>();

    series.forEach((seriesItem) => {
      const originalData = [...seriesItem.data];
      originalDataMap.set(seriesItem.name, originalData);

      seriesItem.data = seriesItem.data.map((value, colIndex) => {
        const total = columnTotals[colIndex];
        return total > 0 ? +((value / total) * 100).toFixed(2) : 0;
      });
    });

    const yAxisData = [...COLOR_RANK]
      .map(([color, name]) => ({
        value: name,
        textStyle: {
          color: color,
        },
      }))
      .filter((_, index) => {
        let total = 0;

        series.forEach((seriesItem) => {
          total += seriesItem.data[index];
        });

        return total > 0;
      });

    const legendData = ROLE_CLASSES.map((key) => ({
      name: ROLE_CLASSES_NAME_MAP[key as RoleClasses],
      icon: "roundRect",
    }));

    legendData.splice(5, 0, "\n" as any);

    return {
      title: {
        text: "职业分数分布",
      },
      grid: {
        left: "2%",
        right: "3%",
        bottom: "15%",
        top: "15%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        backgroundColor: "#121212",
        borderColor: "#121212",
        textStyle: {
          color: "#f0f0f0",
          fontWeight: "normal",
        },
        formatter: function (params: any) {
          let result = `<div>${params[0].axisValue}</div>`;
          params.forEach((param: any) => {
            const originalValue =
              param.seriesName && originalDataMap.has(param.seriesName)
                ? originalDataMap.get(param.seriesName)![param.dataIndex]
                : 0;

            if (originalValue === 0) return;

            const color = param.color;
            const seriesName = param.seriesName;
            const percentValue = param.value;

            result += `<div style="display:flex;justify-content:space-between;margin:3px 0">
              <span style="margin-right:15px">
                <span style="display:inline-block;width:10px;height:10px;background:${color};margin-right:5px;border-radius:50%;"></span>
                ${seriesName}
              </span>
              <span>${originalValue} (${percentValue}%)</span>
            </div>`;
          });

          return result;
        },
      },
      legend: {
        data: legendData,
        right: "5%",
        top: 0,
      },
      xAxis: {
        type: "value",
        max: 100,
        axisLabel: {
          formatter: "{value}%",
        },
      },
      yAxis: {
        type: "category",
        data: yAxisData,
      },
      series: series,
    };
  }, [WCLRanksMap]);

  return (
    <Flex className="w-full h-full min-h-0" vertical>
      <Row className="flex-1 min-h-0">
        <BaseCharts options={chartOptions1} />
      </Row>
      <Row className="flex-1 min-h-0">
        <Col md={12} span={24} className="h-full">
          <BaseCharts options={chartOptions2} />
        </Col>
        <Col md={12} span={24} className="h-full">
          <BaseCharts options={chartOptions3} />
        </Col>
      </Row>
    </Flex>
  );
}

export default Charts;
