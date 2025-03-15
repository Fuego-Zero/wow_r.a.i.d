"use client";

import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, theme, Layout, App } from "antd";
import zhCN from "antd/locale/zh_CN";
import "@ant-design/v5-patch-for-react-19";
import classNames from "classnames";
import { AuthProvider, useAuth } from "../player/context/authContext";
import { AppConfigProvider } from "../player/context/appConfigContext";
import UserList from "./components/UserList";
import { Header } from "./components/Header";

function PlayerContent() {
  const { isAdmin } = useAuth();

  return (
    <Layout className={classNames("h-[100vh] flex overflow-auto")}>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Content className="min-w-0">
        {isAdmin ? (
          <div className="p-4">
            <UserList />
          </div>
        ) : (
          <>无权浏览</>
        )}
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
            <AppConfigProvider>
              <PlayerContent />
            </AppConfigProvider>
          </AuthProvider>
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
}
