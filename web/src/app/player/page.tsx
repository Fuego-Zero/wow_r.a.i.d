"use client";

import "@ant-design/v5-patch-for-react-19";
import classNames from "classnames";
import Login from "./components/Login";
import { useAuth } from "./context/authContext";
import UserCenter from "./components/UserCenter";
import { Header } from "./components/Header";
import BaseProvider from "../components/common/BaseProvider";
import { Layout } from "antd";

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
    <BaseProvider>
      <PlayerContent />
    </BaseProvider>
  );
}
