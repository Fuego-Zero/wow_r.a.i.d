import { Button, Card, notification } from "antd";
import React, { useRef, useState } from "react";
import Actor from "./Actor";
import Players from "./Players";

import mock from "@/data/mock.json";
import { toPng } from "html-to-image";

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
  const el = useRef(null);
  const [isShowBtn, setIsShowBtn] = useState(true);

  async function onCopy() {
    if (!el.current) return;
    setIsShowBtn(false);

    const dataUrl = await toPng(el.current, { cacheBust: true });
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);

    notification.success({
      message: "复制成功",
      description: "已将图片复制到剪贴板",
      duration: 1,
    });

    setIsShowBtn(true);
  }

  return (
    <Card
      size="small"
      title={data.time}
      extra={
        isShowBtn && (
          <Button type="link" onClick={onCopy}>
            复制
          </Button>
        )
      }
      ref={el}
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
