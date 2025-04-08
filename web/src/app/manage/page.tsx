"use client";

import "@ant-design/v5-patch-for-react-19";
import classNames from "classnames";
import { useAuth } from "../player/context/authContext";
import UserList from "./components/UserList";
import { Header } from "./components/Header";
import BaseProvider from "../components/common/BaseProvider";
import { Layout } from "antd";
import useCreateAccount from "./hooks/useCreateAccount";
import { useState } from "react";

function PlayerContent() {
  const { isAdmin } = useAuth();

  const [open, holder] = useCreateAccount();
  const [userListKey, setUserListKey] = useState(0);

  function openCreateAccount() {
    open().then(() => {
      setUserListKey((prev) => prev + 1);
    });
  }

  return (
    <Layout className={classNames("h-[100vh] flex overflow-auto")}>
      <Layout.Header>
        <Header openCreateAccount={openCreateAccount} />
      </Layout.Header>
      <Layout.Content className="min-w-0">
        {isAdmin ? (
          <div className="p-4">
            <UserList key={userListKey} />
          </div>
        ) : (
          <>无权浏览</>
        )}
        {holder}
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
