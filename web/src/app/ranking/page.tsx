"use client";

import { Layout } from "antd";
import "@ant-design/v5-patch-for-react-19";

import BaseProvider from "../components/common/BaseProvider";
import AppPublicMenu from "../components/AppPublicMenu";
import WCLContent from "./component/WCLContent";

function RankingContent() {
  return (
    <Layout className="h-[100vh] flex overflow-auto">
      <Layout.Header className="sticky top-0 z-10 w-full flex items-center">
        <h1 className="flex-1 truncate min-w-0">
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl text-amber-50">
            轻风之语
          </span>
          <span className="ml-2">WCL 排行榜</span>
        </h1>
        <AppPublicMenu />
      </Layout.Header>
      <Layout.Content>
        <WCLContent />
      </Layout.Content>
    </Layout>
  );
}

export default function Ranking() {
  return (
    <BaseProvider>
      <RankingContent />
    </BaseProvider>
  );
}
