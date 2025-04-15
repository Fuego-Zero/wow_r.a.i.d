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

type Props = {
  filtered: WCLRank[];
};

function Charts(props: Props) {
  const { filtered } = props;
  const { WCLRanksMap } = useAppConfig();

  const chartOptions1 = useMemo<ECBasicOption>(() => {
    const ROLE_CLASSES: RoleClasses[] = [
      "DK",
      "XD",
      "LR",
      "FS",
      "QS",
      "MS",
      "DZ",
      "SM",
      "SS",
      "ZS",
    ];

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
        text: "全部职业数量与分布",
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

    const data = WCLRanksMap.values().reduce(
      (acc, item) => {
        acc[getWClColor(item.average_rank_percent)!]++;
        return acc;
      },
      {
        "#e5cc80": 0,
        "#e268a8": 0,
        "#ff8000": 0,
        "#a335ee": 0,
        "#0070ff": 0,
        "#1eff00": 0,
        "#666666": 0,
      }
    );

    const seriesData = COLOR_RANK.keys()
      .map((color) => ({
        value: data[color as keyof typeof data],
        name: COLOR_RANK.get(color)!,
        itemStyle: {
          color: color,
        },
        label: {
          fontSize: 14,
          color: color,
          formatter: "{c} ({d}%)",
        },
      }))
      .filter((item) => item.value > 0);

    return {
      title: {
        text: "全部职业分数与分布",
      },
      series: [
        {
          type: "pie",
          data: [...seriesData],
          radius: ["35%", "65%"],
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
      ["#e5cc80", "金色"],
      ["#e268a8", "粉色"],
      ["#ff8000", "橙色"],
      ["#a335ee", "紫色"],
      ["#0070ff", "蓝色"],
      ["#1eff00", "绿色"],
      ["#666666", "灰色"],
    ]);

    const data = filtered.reduce(
      (acc, item) => {
        acc[getWClColor(item.average_rank_percent)!]++;
        return acc;
      },
      {
        "#e5cc80": 0,
        "#e268a8": 0,
        "#ff8000": 0,
        "#a335ee": 0,
        "#0070ff": 0,
        "#1eff00": 0,
        "#666666": 0,
      }
    );

    const seriesData = COLOR_RANK.keys()
      .map((color) => ({
        value: data[color as keyof typeof data],
        name: COLOR_RANK.get(color)!,
        itemStyle: {
          color: color,
        },
        label: {
          fontSize: 14,
          color: color,
          formatter: "{c} ({d}%)",
        },
      }))
      .filter((item) => item.value > 0);

    return {
      title: {
        text: "当前天赋分数与分布",
      },
      series: [
        {
          type: "pie",
          data: [...seriesData],
          radius: ["35%", "65%"],
          itemStyle: {
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "#000",
          },
        },
      ],
    };
  }, [filtered]);

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
