import Actor from "@/app/components/Actor";
import useTalentSelect from "@/app/hooks/useTalentSelect";
import { useAppConfig } from "@/app/player/context/appConfigContext";
import { WCLRank } from "@/app/player/types";
import { getWClColor } from "@/app/utils";
import { Col, Divider, Row, Table, TableColumnsType } from "antd";
import React, { memo, useMemo } from "react";

type DataType = WCLRank & { key: React.Key };

const columns: TableColumnsType<DataType> = [
  //   { title: "玩家", dataIndex: "user_name" },
  {
    title: "角色",
    dataIndex: "role_name",
    // render: (_, record) => {
    //   return <Players classes={record.}></Players>;
    // },
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
  },
];

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
    <Row gutter={[16, 16]} className="!mx-0">
      <Col span={24} className="mt-5">
        {contextHolder}
      </Col>
      <Col span={24}>
        <Divider className="my-4" />
        <Table<DataType>
          pagination={false}
          columns={columns}
          dataSource={dataSource}
        />
      </Col>
    </Row>
  );
}

export default memo(WCLContent);
