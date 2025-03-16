"use client";

import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, theme, Layout, App, message } from "antd";
import zhCN from "antd/locale/zh_CN";
import "@ant-design/v5-patch-for-react-19";
import classNames from "classnames";
import RaidContent from "./raid-roster/component/RaidContent";
import { useEffect, useMemo, useState } from "react";
import { PlayersData, RaidData } from "./raid-roster/types";
import { formatRaidDataData } from "./utils";
import { getPublishedSchedule } from "./api";
import { isBizException } from "@yfsdk/web-basic-library";

export default function Home() {
  const [playersData, setPlayersData] = useState<PlayersData>([]);

  const raidData = useMemo<RaidData>(() => {
    return formatRaidDataData(playersData);
  }, [playersData]);

  async function onLoadPlayersData() {
    try {
      const res = await getPublishedSchedule();
      setPlayersData(res);
    } catch (error) {
      if (isBizException(error)) return message.error(error.message);
      throw error;
    }
  }

  useEffect(() => {
    onLoadPlayersData();
  }, []);

  return (
    <StyleProvider layer>
      <ConfigProvider locale={zhCN} theme={{ algorithm: theme.darkAlgorithm }}>
        <App>
          <Layout
            className={classNames("h-[100vh] flex overflow-auto")}
            // ref={el}
          >
            <Layout.Header className="sticky top-0 z-10 w-full">
              <h1 className="flex-1">
                <span className="text-2xl text-amber-50">轻风之语</span>
                <span className="ml-2">(副本活动排班表)</span>
              </h1>
            </Layout.Header>
            <Layout.Content>
              <RaidContent data={raidData} displayMode={true} />
            </Layout.Content>
          </Layout>
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
}
