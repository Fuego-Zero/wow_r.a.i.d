"use client";

import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, theme, Layout, App } from "antd";
import zhCN from "antd/locale/zh_CN";
import "@ant-design/v5-patch-for-react-19";
import classNames from "classnames";

export default function Home() {
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
            <Layout.Content>333</Layout.Content>
          </Layout>
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
}
