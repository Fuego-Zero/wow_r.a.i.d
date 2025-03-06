"use client";

import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, theme, Layout, App, notification } from "antd";
import zhCN from "antd/locale/zh_CN";
import AppHeader from "./components/AppHeader";
import "@ant-design/v5-patch-for-react-19";
import RaidContent from "./components/RaidContent";
import { useEffect, useRef, useState } from "react";
import { Data } from "./types";
import storage from "@/app/classes/Storage";
import { toPng } from "html-to-image";
import classNames from "classnames";
import { htmlToPngDownload } from "./utils";
import { ActorMap } from "./components/RaidContent/constant";

const { Header, Content } = Layout;

export default function Home() {
  const [data, setData] = useState<Data>([]);
  const [isHiddenBtn, setIsHiddenBtn] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    setData(storage.getData());
  }, []);

  function setDataHandler(value: Data) {
    storage.setData(value);
    setData(value);
  }

  const el = useRef<HTMLElement>(null);

  async function invokeWithStyleReset(
    el: HTMLElement,
    task: () => Promise<void>
  ) {
    setIsHiddenBtn(true);

    const originalStyle = {
      overflow: window.getComputedStyle(el).overflow,
      height: window.getComputedStyle(el).height,
      maxHeight: window.getComputedStyle(el).maxHeight,
    };

    el.style.overflow = "visible";
    el.style.height = "auto";
    el.style.maxHeight = "none";

    await task();

    el.style.overflow = originalStyle.overflow;
    el.style.height = originalStyle.height;
    el.style.maxHeight = originalStyle.maxHeight;
    setIsHiddenBtn(false);
  }

  async function onCopy() {
    if (!el.current) return;
    const innerEl = el.current;

    invokeWithStyleReset(innerEl, async () => {
      const dataUrl = await toPng(innerEl, { cacheBust: true });
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      api.success({
        message: "复制成功",
        description: "已将图片复制到剪贴板",
        duration: 1,
      });
    });
  }

  async function onDownload() {
    if (!el.current) return;
    const innerEl = el.current;

    invokeWithStyleReset(innerEl, async () => {
      await htmlToPngDownload(innerEl, new Date().toLocaleString());

      notification.success({
        message: "下载成功",
        description: "图片已成功下载",
        duration: 1,
      });
    });
  }

  function delPlayer(time: string, index: number) {
    const newData = data.map((item) => {
      if (item.time !== time) return item;

      item.players[index] = { actor: ActorMap.EMPTY, name: "" };
      return item;
    });

    setDataHandler(newData);
  }

  return (
    <StyleProvider layer>
      <ConfigProvider locale={zhCN} theme={{ algorithm: theme.darkAlgorithm }}>
        <App>
          <Layout
            className={classNames(
              { "hidden-button": isHiddenBtn },
              "h-[100vh] flex overflow-auto"
            )}
            ref={el}
          >
            <Header className="sticky top-0 z-10 w-full">
              <AppHeader
                setData={setDataHandler}
                onCopy={onCopy}
                onDownload={onDownload}
              />
            </Header>
            <Content>
              <RaidContent data={data} delPlayer={delPlayer} />
            </Content>
          </Layout>
          {contextHolder}
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
}
