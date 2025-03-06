import { Button, Card } from "antd";
import React from "react";
import Actor from "./Actor";
import Players from "./Players";

import mock from "@/data/mock.json";

type Actor = Parameters<typeof Actor>["0"]["actor"];

type Data = {
  time: string;
  players: Array<{
    name: string;
    actor: Actor;
  }>;
};

const data: Data = mock[0] as Data;

function RaidCard() {
  return (
    <Card
      size="small"
      title={data.time}
      extra={<Button type="link">复制</Button>}
    >
      {data.players.map((item, index) => (
        <Card.Grid
          key={index}
          hoverable={false}
          className="flex items-center justify-start py-1 px-2 min-w-0 w-[20%]"
        >
          <Actor actor={item.actor} />
          <Players actor={item.actor}>{item.name}</Players>
        </Card.Grid>
      ))}
    </Card>
  );
}

export default RaidCard;
