import {
  App,
  Button,
  Card,
  Space,
  Table,
  TableProps,
  Tag,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { changeRoleDisableSchedule, getAllUsers, resetPassword } from "../api";
import { UserInfo } from "../types";
import { hashPassword } from "@/app/player/utils";
import PlayTime from "@/app/components/PlayTime";
import { CheckOutlined, IdcardFilled, StopOutlined } from "@ant-design/icons";
import Nameplate from "@/app/player/components/Nameplate";
import { isBizException } from "@yfsdk/web-basic-library";
import dayjs from "dayjs";

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
      title: "角色数量",
      dataIndex: "roles",
      key: "roles",
      render: (_, { roles }) => {
        const title = (
          <div className="max-h-[500px] overflow-auto">
            <Card size="small" title="角色列表">
              {roles.map((role) => {
                return (
                  <Card.Grid
                    key={role.id}
                    hoverable={false}
                    className="flex items-center justify-between w-full p-0"
                  >
                    <Nameplate
                      {...role}
                      className="space-x-1 min-w-0 flex-1 truncate"
                    />
                    <div className="mx-2 space-x-2">
                      {role.disable_schedule ? (
                        <StopOutlined
                          title="禁止排班"
                          style={{ color: "red" }}
                          onClick={async () => {
                            try {
                              await changeRoleDisableSchedule(role.id, false);
                              getData();
                              message.success("允许排班成功");
                            } catch (error) {
                              if (isBizException(error)) {
                                return message.error(error.message);
                              }
                              throw error;
                            }
                          }}
                        />
                      ) : (
                        <CheckOutlined
                          title="允许排班"
                          style={{ color: "green" }}
                          onClick={async () => {
                            try {
                              await changeRoleDisableSchedule(role.id, true);
                              getData();
                              message.success("禁止排班成功");
                            } catch (error) {
                              if (isBizException(error)) {
                                return message.error(error.message);
                              }
                              throw error;
                            }
                          }}
                        />
                      )}
                      {role.is_signup && (
                        <Tag color="cyan" className="mx-0">
                          已报名
                        </Tag>
                      )}
                    </div>
                  </Card.Grid>
                );
              })}
            </Card>
          </div>
        );

        const disableScheduleRoles = roles.filter(
          (role) => role.disable_schedule
        );

        return (
          <div className="space-x-1">
            <span>
              {roles.length}
              {disableScheduleRoles.length > 0 && (
                <span
                  title="禁用数量"
                  className="text-red-600 ml-1"
                >{`(${disableScheduleRoles.length})`}</span>
              )}
            </span>
            <Tooltip title={title}>
              <IdcardFilled />
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "报名时间",
      dataIndex: "play_time",
      key: "play_time",
      render: (_, { play_time }) => <PlayTime play_time={play_time} />,
    },
    {
      title: "最后登录时间",
      dataIndex: "last_login_time",
      key: "last_login_time",
      render: (_, { last_login_time }) => (
        <>
          {last_login_time
            ? dayjs(last_login_time).format("YYYY-MM-DD HH:mm:ss")
            : "-"}
        </>
      ),
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
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              onResetPassword(record.id, PW);
            }}
          >
            重置密码
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
