"use client";

import { Layout } from "antd";
import "@ant-design/v5-patch-for-react-19";

import BaseProvider from "../components/common/BaseProvider";
import AppPublicMenu from "../components/AppPublicMenu";
import WCLContent from "./component/WCLContent";
import AppTitle from "../components/AppTitle";

function RankingContent() {
  return (
    <Layout className="h-[100vh] flex overflow-auto">
      <Layout.Header className="sticky top-0 z-10 w-full flex items-center">
        <AppTitle title="轻风之语" subTitle="WCL 排行榜" />
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
