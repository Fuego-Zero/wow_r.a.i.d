import { App, Button, Card } from "antd";
import React, { memo, useMemo, useRef } from "react";
import Actor from "./Actor";
import Players from "./Players";

import { toPng } from "html-to-image";
import { RaidData, InferArrayItem, Handler } from "@/app/types";
import { CloseOutlined } from "@ant-design/icons";
import { htmlToPngDownload } from "@/app/utils";
import Empty from "./Empty";
import classNames from "classnames";

type Data = InferArrayItem<RaidData>;
type Player = InferArrayItem<Data["players"]>;

function RaidCard(
  props: {
    data: Data;
  } & Handler
) {
  const { data, delPlayer, selectPlayer, rosterPlayer } = props;
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

    await htmlToPngDownload(el.current, data.title);

    notification.success({
      message: "下载成功",
      description: "图片已成功下载",
      duration: 1,
    });
  }

  const innerPlayers = useMemo(() => {
    const empty = Array.from({
      length: 25,
    }).fill({
      actor: "EMPTY",
      name: "空缺",
    }) as Player[];

    return data.players.concat(empty).slice(0, 25);
  }, [data.players]);

  return (
    <Card
      size="small"
      title={data.title}
      className="group/RaidCard"
      extra={
        <div className="group-hover/RaidCard:block hidden">
          <Button
            type="link"
            onClick={() => {
              rosterPlayer(data.time, data.title);
            }}
          >
            编辑
          </Button>
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
      {innerPlayers.map((item, index) => (
        <Card.Grid
          key={index}
          hoverable={false}
          className={classNames(
            "flex relative items-center justify-start py-1 px-2 min-w-0 w-[20%] min-h-[44px] group/delPlayer",
            {
              "bg-amber-300/20": item.name === "空缺",
            }
          )}
        >
          {/* // TODO 该处要修复 */}
          {item.actor !== "SM" ? (
            <>
              <Actor actor={item.actor} />
              <Players classes="DK">{item.name}</Players>
              <Button
                className="hidden group-hover/delPlayer:block absolute right-0"
                type="link"
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => delPlayer(data.title, item.name)}
              />
            </>
          ) : (
            <Empty
              onClick={() => {
                selectPlayer(data.time, data.title);
              }}
            />
          )}
        </Card.Grid>
      ))}
    </Card>
  );
}

export default memo(RaidCard);
