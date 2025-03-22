import { App, Button, Space, Table, TableProps, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { getAllUsers, resetPassword } from "../api";
import { UserInfo } from "../types";
import { hashPassword } from "@/app/player/utils";
import PlayTime from "@/app/components/PlayTime";

const PW = "ly0uQlp7LMaMVhzh"; /* cspell: disable-line */

function UserList() {
  const [data, setData] = useState<UserInfo[]>([]);
  const { message } = App.useApp();

  const columns: TableProps<UserInfo>["columns"] = [
    {
      title: "用户名",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "微信名",
      dataIndex: "wechat_name",
      key: "wechat_name",
    },
    {
      title: "账号",
      dataIndex: "account",
      key: "account",
    },
    {
      title: "报名时间",
      dataIndex: "play_time",
      key: "play_time",
      render: (_, { play_time }) => <PlayTime play_time={play_time} />,
    },
    {
      title: "身份",
      dataIndex: "is_admin",
      key: "is_admin",
      render: (_, { is_admin }) => (
        <>
          {is_admin ? (
            <Tag color="green">管理员</Tag>
          ) : (
            <Tag color="magenta">普通用户</Tag>
          )}
        </>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              onResetPassword(record.id, PW);
            }}
          >
            重设密码
          </Button>
        </Space>
      ),
    },
  ];

  async function getData() {
    const users = await getAllUsers();
    setData(users);
  }

  async function onResetPassword(id: UserInfo["id"], pw: string) {
    const password = await hashPassword(pw);
    await resetPassword(id, password);
    message.success("重设密码成功：" + pw);
  }

  useEffect(() => {
    getData();
  }, []);

  return <Table<UserInfo> rowKey="id" columns={columns} dataSource={data} />;
}

export default UserList;
