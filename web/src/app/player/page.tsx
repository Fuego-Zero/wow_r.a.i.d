"use client";

import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, theme, Layout, App } from "antd";
import zhCN from "antd/locale/zh_CN";
import "@ant-design/v5-patch-for-react-19";
import classNames from "classnames";
import Login from "./components/Login";
import { AuthProvider, useAuth } from "./context";
import UserCenter from "./components/UserCenter";
import { Header } from "./components/Header";

function PlayerContent() {
  const { isLogin } = useAuth();

  return (
    <Layout className={classNames("h-[100vh] flex overflow-auto")}>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Content className="min-w-0">
        {isLogin ? <UserCenter /> : <Login />}
      </Layout.Content>
    </Layout>
  );
}

export default function Player() {
  return (
    <StyleProvider layer>
      <ConfigProvider locale={zhCN} theme={{ algorithm: theme.darkAlgorithm }}>
        <App>
          <AuthProvider>
            <PlayerContent />
          </AuthProvider>
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
}
