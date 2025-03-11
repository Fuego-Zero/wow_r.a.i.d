"use client";

import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, theme, Layout, App, notification } from "antd";
import zhCN from "antd/locale/zh_CN";
import AppHeader from "./components/AppHeader";
import "@ant-design/v5-patch-for-react-19";
import RaidContent from "./components/RaidContent";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlayersData, RaidData } from "./types";
import storage from "@/app/classes/Storage";
import { toPng } from "html-to-image";
import classNames from "classnames";
import { htmlToPngDownload } from "./utils";
import { ACTOR_ORDER, DAY_ORDER } from "./common";
import usePlayerSelect from "./components/RaidContent/hooks/usePlayerSelect";

const { Header, Content } = Layout;

function extractTimeNumber(timeString: string): number {
  const match = timeString.match(/\d{2}:\d{2}/);
  if (match) return parseInt(match[0].replace(":", ""), 10);
  return 0;
}

export default function Home() {
  const [playersData, setPlayersData] = useState<PlayersData>([]);
  const [isHiddenBtn, setIsHiddenBtn] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    setPlayersData(storage.getData());
  }, []);

  function setDataHandler(value: PlayersData) {
    storage.setData(value);
    setPlayersData(value);
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

  const delPlayer = useCallback(
    (groupTitle: string, playerName: string) => {
      const newData = playersData.map((item) => {
        if (item.group[1] !== groupTitle) return item;
        if (item.name !== playerName) return item;

        item.group = [];
        return item;
      });

      setDataHandler(newData);
    },
    [playersData]
  );

  const clearPlayersData = useCallback(() => {
    storage.clear();
    setPlayersData([]);
  }, []);

  const raidData = useMemo<RaidData>(() => {
    const data: RaidData = [];

    const groupedPlayers = playersData.reduce((prev, item) => {
      if (!item.group.length) return prev;

      const key = JSON.stringify(item.group);
      item.name = `${item.pname} (${item.cname})`;
      prev[key] ??= [];
      prev[key].push(item);

      return prev;
    }, {} as Record<string, PlayersData>);

    Object.values(groupedPlayers).forEach((players) => {
      players.sort((a, b) => {
        const actorA = ACTOR_ORDER.indexOf(a.actor);
        const actorB = ACTOR_ORDER.indexOf(b.actor);
        return actorA - actorB;
      });
    });

    const sortedKeys = Object.keys(groupedPlayers).sort((a, b) => {
      const [dayA, timeA] = JSON.parse(a) as [number, string];
      const [dayB, timeB] = JSON.parse(b) as [number, string];

      const dayIndexA = DAY_ORDER.indexOf(dayA);
      const dayIndexB = DAY_ORDER.indexOf(dayB);

      if (dayIndexA !== dayIndexB) return dayIndexA - dayIndexB;
      return extractTimeNumber(timeA) - extractTimeNumber(timeB);
    });

    sortedKeys.forEach((key) => {
      const [time, title] = JSON.parse(key) as [number, string];
      const players = groupedPlayers[key];

      data.push({
        title,
        time,
        players,
      });
    });

    return data;
  }, [playersData]);

  const [openSelectModal, selectModalContextHolder] =
    usePlayerSelect(playersData);

  const selectPlayer = useCallback(
    async (time: number, title: string) => {
      const player = await openSelectModal(time, title);

      playersData.forEach((item) => {
        if (item.name === player.name) item.group = [];
      });
      player.group = [time, title];

      setDataHandler([...playersData]);
    },
    [openSelectModal, playersData]
  );

  const showAdvancedBtn = useMemo(() => {
    return raidData.length > 0;
  }, [raidData]);

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
                clearPlayersData={clearPlayersData}
                showAdvancedBtn={showAdvancedBtn}
              />
            </Header>
            <Content>
              <RaidContent
                data={raidData}
                delPlayer={delPlayer}
                selectPlayer={selectPlayer}
              />
            </Content>
          </Layout>
          {contextHolder}
          {selectModalContextHolder}
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
}
