import { App, Button, Card } from "antd";
import React, { useRef } from "react";
import Actor from "./Actor";
import Players from "./Players";

// import mock from "@/data/mock.json";
import { toPng } from "html-to-image";
import { Data, InferArrayItem } from "@/app/types";
import { CloseOutlined } from "@ant-design/icons";
import { htmlToPngDownload } from "@/app/utils";
import Empty from "./Empty";
import classNames from "classnames";

function RaidCard(props: {
  data: InferArrayItem<Data>;
  delPlayer: (time: string, index: number) => void;
}) {
  const { data, delPlayer } = props;
  const { notification } = App.useApp();
  const el = useRef(null);

  async function onCopy() {
    if (!el.current) return;

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
  }

  async function onDownload() {
    if (!el.current) return;

    await htmlToPngDownload(el.current, data.time);

    notification.success({
      message: "下载成功",
      description: "图片已成功下载",
      duration: 1,
    });
  }

  return (
    <Card
      size="small"
      title={data.time}
      className="group/RaidCard"
      extra={
        <div className="group-hover/RaidCard:block hidden">
          <Button type="link" onClick={onDownload}>
            下载
          </Button>
          <Button type="link" onClick={onCopy}>
            复制
          </Button>
        </div>
      }
      ref={el}
    >
      {data.players.map((item, index) => (
        <Card.Grid
          key={index}
          hoverable={false}
          className={classNames(
            "flex relative items-center justify-start py-1 px-2 min-w-0 w-[20%] group/delPlayer",
            {
              "bg-amber-300/20": item.name === "空缺",
            }
          )}
        >
          {item.actor !== "EMPTY" ? (
            <>
              <Actor actor={item.actor} />
              <Players actor={item.actor}>{item.name}</Players>
              <Button
                className="hidden group-hover/delPlayer:block absolute right-0"
                type="link"
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => delPlayer(data.time, index)}
              />
            </>
          ) : (
            <Empty
              onClick={() => {
                console.log(data.time, index);
              }}
            />
          )}
        </Card.Grid>
      ))}
    </Card>
  );
}

export default RaidCard;
