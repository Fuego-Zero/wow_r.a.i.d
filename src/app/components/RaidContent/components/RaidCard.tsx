import { Button, Card } from "antd";
import React from "react";
import Actor from "./Actor";
import Players from "./Players";

const gridStyle: React.CSSProperties = {
  width: "20%",
};

type Actor = Parameters<typeof Actor>["0"]["actor"];

type PlayerInfo = {
  name: string;
  actor: Actor;
};

const data: PlayerInfo[] = [
  {
    name: "戴森(ofo)",
    actor: "FQ",
  },
  {
    name: "少侠(少侠好讨厌)",
    actor: "XDK",
  },
  {
    name: "大力(元素奶大力)",
    actor: "DS",
  },
  {
    name: "丶黑哥哥(丶哎呀呀)",
    actor: "AM",
  },
  {
    name: "紫菱(紫樱)",
    actor: "AF",
  },
  {
    name: "毛衣(粉毛衣)",
    actor: "FQ",
  },
  {
    name: "Cnfive(姚城葉少)",
    actor: "XDK",
  },
  {
    name: "白胖(白胖)",
    actor: "HF",
  },
  {
    name: "龍兄(龍宝)",
    actor: "EMS",
  },
  {
    name: "薄荷(胖九)",
    actor: "NQ",
  },
  {
    name: "小元(Holmes(血DK",
    actor: "DKT",
  },
  {
    name: "老王的X娃(老王的九娃)",
    actor: "ZQS",
  },
  {
    name: "张三(我系大聪明)",
    actor: "TKS",
  },
  {
    name: "新哥(馨涵玥)",
    actor: "SCL",
  },
  {
    name: "大哥(午夜列车)",
    actor: "NQ",
  },
  {
    name: "可美(可美)",
    actor: "CSZ",
  },
  {
    name: "么么7(么么其)",
    actor: "CJQ",
  },
  {
    name: "狗哥(小松浒)",
    actor: "ACD",
  },
  {
    name: "威震天(国服威震天)",
    actor: "SWL",
  },
  {
    name: "老四(骄花大妈)",
    actor: "JLM",
  },
  {
    name: "菲兹(龙猫)",
    actor: "FZ",
  },
  {
    name: "古子哥(古古小术)",
    actor: "TKS",
  },
  {
    name: "小K(Littlekhua)",
    actor: "BF",
  },
  {
    name: "天亮(高杆加强塞)",
    actor: "TKS",
  },
  {
    name: "甜思思(烁祺)",
    actor: "ND",
  },
];

function RaidCard() {
  return (
    <Card
      size="small"
      title="周四 - 19:30"
      extra={<Button type="link">复制</Button>}
    >
      {data.map((item, index) => (
        <Card.Grid
          key={index}
          style={gridStyle}
          hoverable={false}
          className="flex items-center justify-start py-1 px-2 min-w-0"
        >
          <Actor actor={item.actor} />
          <Players actor={item.actor}>{item.name}</Players>
        </Card.Grid>
      ))}
    </Card>
  );
}

export default RaidCard;
