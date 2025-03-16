"use client";

import "@ant-design/v5-patch-for-react-19";
import classNames from "classnames";
import { useAuth } from "../player/context/authContext";
import UserList from "./components/UserList";
import { Header } from "./components/Header";
import BaseProvider from "../components/common/BaseProvider";
import { Layout } from "antd";

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
    <BaseProvider>
      <PlayerContent />
    </BaseProvider>
  );
}
