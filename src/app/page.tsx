"use client";

import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, theme, Layout, App } from "antd";
import zhCN from "antd/locale/zh_CN";
import AppHeader from "./components/AppHeader";
import "@ant-design/v5-patch-for-react-19";
import RaidContent from "./components/RaidContent";
import { useState } from "react";
import { Data } from "./types";

const { Header, Content } = Layout;

export default function Home() {
  const [data, setData] = useState<Data>([]);

  return (
    <StyleProvider layer>
      <ConfigProvider locale={zhCN} theme={{ algorithm: theme.darkAlgorithm }}>
        <App>
          <Layout className="h-[100vh] flex overflow-auto">
            <Header className="sticky top-0 z-10 w-full">
              <AppHeader setData={setData} />
            </Header>
            <Content>
              <RaidContent data={data} />
            </Content>
          </Layout>
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
}
