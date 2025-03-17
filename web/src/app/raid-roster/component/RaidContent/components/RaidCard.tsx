import { App, Button, Card } from "antd";
import React, { memo, useMemo, useRef, useState } from "react";

import { toPng } from "html-to-image";
import { CloseOutlined } from "@ant-design/icons";
import { htmlToPngDownload } from "@/app/utils";
import Empty from "./Empty";
import classNames from "classnames";
import { InferArrayItem } from "@yfsdk/web-basic-library";
import { Handler, RaidData } from "@/app/raid-roster/types";
import Nameplate from "@/app/player/components/Nameplate";

type Data = InferArrayItem<RaidData>;
type Player = InferArrayItem<Data["players"]>;

function RaidCard(
  props: {
    data: Data;
    displayMode?: boolean;
  } & Partial<Handler>
) {
  const { data, displayMode, delPlayer, selectPlayer, rosterPlayer } = props;
  const { notification } = App.useApp();
  const el = useRef(null);

  const [hideBtn, setHideBtn] = useState(false);

  async function onCopy() {
    if (!el.current) return;
    setHideBtn(true);

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

    setHideBtn(false);
  }

  async function onDownload() {
    if (!el.current) return;
    setHideBtn(true);

    await htmlToPngDownload(el.current, data.group_title);

    notification.success({
      message: "下载成功",
      description: "图片已成功下载",
      duration: 1,
    });

    setHideBtn(false);
  }

  const innerPlayers = useMemo(() => {
    const empty = Array.from({
      length: 25,
    }).fill({}) as Player[];

    return data.players.concat(empty).slice(0, 25);
  }, [data.players]);

  return (
    <Card
      size="small"
      title={data.group_title}
      className="group/RaidCard"
      extra={
        !hideBtn && (
          <div className="group-hover/RaidCard:block hidden">
            {!displayMode && (
              <Button
                type="link"
                onClick={() => {
                  rosterPlayer?.(data.group_time_key, data.group_title);
                }}
              >
                编辑
              </Button>
            )}
            <Button type="link" onClick={onDownload}>
              下载
            </Button>
            <Button type="link" onClick={onCopy}>
              复制
            </Button>
          </div>
        )
      }
      ref={el}
    >
      {innerPlayers.map((item, index) => (
        <Card.Grid
          key={index}
          hoverable={false}
          className={classNames(
            "flex relative items-center justify-start py-1 px-1 min-w-0 w-[20%] min-h-[52px] group/delPlayer"
            // {
            //   "bg-amber-300/20": item.name === "空缺", //todo 未来针对暂缺情况的样式
            // }
          )}
        >
          {item.role_id ? (
            <>
              <Nameplate
                className="flex-1"
                classes={item.classes}
                role_name={item.role_name}
                user_name={item.user_name}
                talent={item.talent}
              />

              {!displayMode && (
                <Button
                  className="hidden group-hover/delPlayer:block absolute right-0 top-0"
                  type="link"
                  size="small"
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => delPlayer?.(item.role_id)}
                />
              )}
            </>
          ) : (
            <Empty
              onClick={() => {
                if (displayMode) return;
                selectPlayer?.(data.group_time_key, data.group_title);
              }}
            />
          )}
        </Card.Grid>
      ))}
    </Card>
  );
}

export default memo(RaidCard);
