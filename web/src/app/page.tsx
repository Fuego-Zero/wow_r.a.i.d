"use client";

import { Layout, message } from "antd";
import "@ant-design/v5-patch-for-react-19";
import classNames from "classnames";
import RaidContent from "./raid-roster/component/RaidContent";
import { useEffect, useMemo, useState } from "react";
import { PlayersData, RaidData } from "./raid-roster/types";
import { formatRaidDataData } from "./utils";
import { getPublishedSchedule } from "./api";
import { isBizException } from "@yfsdk/web-basic-library";
import BaseProvider from "./components/common/BaseProvider";
import AppPublicMenu from "./components/AppPublicMenu";
import AppTitle from "./components/AppTitle";

function HomeContent() {
  const [playersData, setPlayersData] = useState<PlayersData>([]);
  const [loading, setLoading] = useState(true);

  const raidData = useMemo<RaidData>(() => {
    return formatRaidDataData(playersData);
  }, [playersData]);

  async function onLoadPlayersData() {
    try {
      setLoading(true);
      const res = await getPublishedSchedule();
      setPlayersData(res);
    } catch (error) {
      if (isBizException(error)) return message.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    onLoadPlayersData();
  }, []);

  return (
    <Layout className={classNames("h-[100vh] flex overflow-auto")}>
      <Layout.Header className="sticky top-0 z-10 w-full flex items-center">
        <AppTitle title="轻风之语" subTitle="副本活动排班表" />
        <AppPublicMenu />
      </Layout.Header>
      <Layout.Content>
        <RaidContent loading={loading} data={raidData} displayMode={true} />
      </Layout.Content>
    </Layout>
  );
}

export default function Home() {
  return (
    <BaseProvider>
      <HomeContent />
    </BaseProvider>
  );
}
