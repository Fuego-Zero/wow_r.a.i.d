"use client";

import { Button, Layout, message } from "antd";
import "@ant-design/v5-patch-for-react-19";
import classNames from "classnames";
import RaidContent from "./raid-roster/component/RaidContent";
import { useEffect, useMemo, useState } from "react";
import { PlayersData, RaidData } from "./raid-roster/types";
import { formatRaidDataData } from "./utils";
import { getPublishedSchedule } from "./api";
import { isBizException } from "@yfsdk/web-basic-library";
import BaseProvider from "./components/common/BaseProvider";
import { useRouter } from "next/navigation";
import Welcome from "./components/Welcome";

function HomeContent() {
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

  const router = useRouter();

  return (
    <Layout className={classNames("h-[100vh] flex overflow-auto")}>
      <Layout.Header className="sticky top-0 z-10 w-full flex items-center">
        <h1 className="flex-1">
          <span className="text-2xl text-amber-50">轻风之语</span>
          <span className="ml-2">(副本活动排班表)</span>
        </h1>
        <Button
          type="link"
          className="ml-2"
          onClick={() => {
            router.push("/player");
          }}
        >
          个人中心
        </Button>
      </Layout.Header>
      <Layout.Content>
        <RaidContent data={raidData} displayMode={true} />
      </Layout.Content>
      <Welcome />
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
