import { App, Button, Card } from "antd";
import React, { memo, useMemo, useRef, useState } from "react";

import { toPng } from "html-to-image";
import { htmlToPngDownload } from "@/app/utils";
import { Player, RaidCardProps } from "./types";
import DesktopRaidCard from "./components/DesktopRaidCard";
import MobileRaidCard from "./components/MobileRaidCard";

function RaidCard(props: RaidCardProps) {
  const { data, displayMode, rosterPlayer } = props;
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
      <DesktopRaidCard players={innerPlayers} {...props} />
      <MobileRaidCard players={innerPlayers} {...props} />
    </Card>
  );
}

export default memo(RaidCard);
