import { App, Button, Card } from "antd";
import React, { useRef, useState } from "react";
import Actor from "./Actor";
import Players from "./Players";

// import mock from "@/data/mock.json";
import { toPng } from "html-to-image";
import { Data, InferArrayItem } from "@/app/types";
import { CloseOutlined } from "@ant-design/icons";
import { htmlToPngDownload } from "@/app/utils";
import { hiddenButtonClass } from "@/app/common";

function RaidCard(props: { data: InferArrayItem<Data> }) {
  const { data } = props;
  const { notification } = App.useApp();
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

  async function onDownload() {
    if (!el.current) return;
    setIsShowBtn(false);

    await htmlToPngDownload(el.current, data.time);

    notification.success({
      message: "下载成功",
      description: "图片已成功下载",
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
          <>
            <Button
              type="link"
              className={hiddenButtonClass}
              onClick={onDownload}
            >
              下载
            </Button>
            <Button type="link" className={hiddenButtonClass} onClick={onCopy}>
              复制
            </Button>
          </>
        )
      }
      ref={el}
    >
      {data.players.map((item, index) => (
        <Card.Grid
          key={index}
          hoverable={false}
          className="flex relative items-center justify-start py-1 px-2 min-w-0 w-[20%] group"
        >
          <Actor actor={item.actor} />
          <Players actor={item.actor}>{item.name}</Players>
          <Button
            className="hidden group-hover:block absolute right-0"
            type="link"
            size="small"
            danger
            icon={<CloseOutlined />}
          />
        </Card.Grid>
      ))}
    </Card>
  );
}

export default RaidCard;
