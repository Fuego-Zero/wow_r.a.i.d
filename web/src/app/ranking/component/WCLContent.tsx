import Actor from "@/app/components/Actor";
import useTalentSelect from "@/app/hooks/useTalentSelect";
import { useAppConfig } from "@/app/player/context/appConfigContext";
import { WCLRank } from "@/app/player/types";
import { getServerRankColor, getWClColor } from "@/app/utils";
import { Col, Divider, Flex, Row, Table, TableColumnsType } from "antd";
import React, { memo, useMemo } from "react";
import Charts from "./components/Charts";
import dynamic from "next/dynamic";

type DataType = WCLRank & { key: React.Key };

const columns: TableColumnsType<DataType> = [
  { title: "玩家", dataIndex: "user_name" },
  {
    title: "角色",
    dataIndex: "role_name",
  },
  {
    title: "天赋",
    dataIndex: "talent",
    render: (talent) => <Actor actor={talent} />,
  },
  {
    title: "最佳平均分",
    dataIndex: "average_rank_percent",
    sorter: (a, b) => a.average_rank_percent - b.average_rank_percent,
    render: (average_rank_percent) => (
      <span style={{ color: getWClColor(average_rank_percent) }}>
        {average_rank_percent}
      </span>
    ),
  },
  {
    title: "服务器排名",
    dataIndex: "server_rank",
    sorter: (a, b) => a.server_rank - b.server_rank,
    render: (server_rank) => (
      <span style={{ color: getServerRankColor(server_rank) }}>
        {server_rank}
      </span>
    ),
  },
];

const ScrollWrap = dynamic(() => import("../../components/common/ScrollWrap"), {
  ssr: false,
});

function WCLContent() {
  const { WCLRanksMap } = useAppConfig();
  const [selectedActor, contextHolder] = useTalentSelect();

  const WCLData = useMemo<Map<WCLRank["talent"], WCLRank[]>>(() => {
    const map = new Map<WCLRank["talent"], WCLRank[]>();

    Array.from(WCLRanksMap.values()).forEach((rank) => {
      if (map.has(rank.talent)) {
        map.get(rank.talent)!.push(rank);
      } else {
        map.set(rank.talent, [rank]);
      }
    });

    Array.from(map.values()).forEach((rank) => {
      rank.sort((a, b) => b.average_rank_percent - a.average_rank_percent);
    });

    return map;
  }, [WCLRanksMap]);

  const dataSource = useMemo<DataType[]>(() => {
    return (
      WCLData.get(selectedActor)?.map((rank, index) => ({
        ...rank,
        key: index,
      })) || []
    );
  }, [WCLData, selectedActor]);

  return (
    <Flex vertical className="h-full">
      <Row gutter={[16, 16]} className="!mx-0">
        <Col span={24}>{contextHolder}</Col>
      </Row>
      <Divider className="my-4" />
      <Row gutter={[16, 16]} className="flex-1 min-h-0 !mx-0">
        <Col span={24} xl={12} className="h-full">
          <ScrollWrap>
            <Table<DataType>
              pagination={false}
              columns={columns}
              dataSource={dataSource}
            />
          </ScrollWrap>
        </Col>
        <Col span={24} xl={12} className="h-full">
          <Charts />
        </Col>
      </Row>
    </Flex>
  );
}

export default memo(WCLContent);
