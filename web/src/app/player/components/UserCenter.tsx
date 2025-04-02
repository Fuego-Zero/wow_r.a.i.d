import { App, Card, Col, Row, Tag, Tooltip } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/authContext";
import BindRole from "./BindRole";
import { getAllRecord, getAllRole } from "../api";
import { RoleInfo, SignupRecord } from "../types";
import UnbindRole from "./UnbindRole";
import { useAppConfig } from "../context/appConfigContext";
import AddSignupRecord from "./AddSignupRecord";
import DelSignupRecord from "./DelSignupRecord";
import EditRole from "./EditRole";
import Nameplate from "./Nameplate";
import {
  FontColorsOutlined,
  SolutionOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { getPublishedSchedule } from "@/app/api";
import { isBizException } from "@yfsdk/web-basic-library";
import axios from "axios";
import PlayTime from "@/app/components/PlayTime";
import RecreateSignupRecord from "./RecreateSignupRecord";

function UserCenter() {
  const { message, notification } = App.useApp();
  const { userInfo } = useAuth();
  const { raidTimeNameMap, reloadWCLRanks } = useAppConfig();
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [signupRecordSet, setSignupRecordSet] = useState<
    Set<SignupRecord["id"]>
  >(new Set());
  const [signupRecords, setSignupRecords] = useState<SignupRecord[]>([]);

  async function onReload() {
    const [roles, records] = await Promise.all([getAllRole(), getAllRecord()]);

    const set = records.reduce((set, record) => {
      set.add(record.role_id);
      return set;
    }, new Set<SignupRecord["id"]>());

    setRoles(roles);
    setSignupRecordSet(new Set(set));
    setSignupRecords(records);
    onLoadScheduleData();
  }

  useEffect(() => {
    onReload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playTime = useMemo(() => {
    return (
      userInfo?.play_time
        .map((time) => raidTimeNameMap.get(time))
        .filter(Boolean) ?? []
    );
  }, [raidTimeNameMap, userInfo?.play_time]);

  const [schedule, setSchedule] = useState(new Map());

  async function onLoadScheduleData() {
    try {
      const res = await getPublishedSchedule();

      const map = res.reduce((map, record) => {
        map.set(record.role_id, record);
        return map;
      }, new Map());

      setSchedule(map);
    } catch (error) {
      if (isBizException(error)) return message.error(error.message);
      throw error;
    }
  }

  const [syncWCLRoles, setSyncWCLRoles] = useState<Set<RoleInfo["role_name"]>>(
    new Set()
  );

  async function syncWCL(roleName: RoleInfo["role_name"]) {
    try {
      setSyncWCLRoles(new Set(syncWCLRoles.add(roleName)));
      await axios.post("/api/wcl_query", { role_name: roleName });
      message.success("同步 WCL 成功");
      reloadWCLRanks();
    } catch (error) {
      notification.error({
        message: "同步 WCL 失败",
        description: (error as Error).message,
      });
      console.log(error);
    } finally {
      setTimeout(() => {
        setSyncWCLRoles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(roleName);
          return newSet;
        });
      }, 500);
    }
  }

  return (
    <Row justify="center" className="max-md:!mx-0 mt-5" gutter={[16, 16]}>
      <Col span={24}>
        <Card
          title={`用户名：${userInfo?.user_name}`}
          size="small"
          extra={`微信名：${userInfo?.wechat_name}`}
        >
          <Card.Grid className="p-2 w-full" hoverable={false}>
            报名时间：{playTime.join("、")}
          </Card.Grid>
          {roles.map((role) => {
            return (
              <Card.Grid className="p-2 w-full" hoverable={false} key={role.id}>
                <div className="flex relative items-center justify-start w-full text-left">
                  <Nameplate
                    classes={role.classes}
                    role_name={role.role_name}
                    talent={role.talent}
                    className="flex-1"
                  />
                  <div className="!space-x-2 [&>*:last-child]:mr-0 ml-2">
                    <Tooltip title="同步WCL">
                      <SyncOutlined
                        spin={syncWCLRoles.has(role.role_name)}
                        className="inline-flex"
                        onClick={() => {
                          if (syncWCLRoles.has(role.role_name)) return;
                          syncWCL(role.role_name);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="查看WCL">
                      <SolutionOutlined
                        onClick={() => {
                          window.open(
                            `https://cn.classic.warcraftlogs.com/character/cn/法琳娜/${role.role_name}`
                          );
                        }}
                      />
                    </Tooltip>
                    {role.auto_signup && (
                      <Tooltip title="自动报名">
                        <FontColorsOutlined />
                      </Tooltip>
                    )}
                    {signupRecordSet.has(role.id) && !schedule.get(role.id) && (
                      <PlayTime
                        play_time={
                          signupRecords.find(
                            (record) => record.role_id === role.id
                          )!.play_time
                        }
                      >
                        <Tag color="cyan">已报名</Tag>
                      </PlayTime>
                    )}
                    {schedule.get(role.id) && (
                      <Tag color="green">
                        {schedule.get(role.id).group_title}
                      </Tag>
                    )}
                  </div>
                </div>
              </Card.Grid>
            );
          })}
        </Card>
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col span={8}>
            <AddSignupRecord
              onReload={onReload}
              roles={roles}
              signupRecords={signupRecordSet}
            />
          </Col>
          <Col span={8}>
            <RecreateSignupRecord onReload={onReload} roles={roles} />
          </Col>
          <Col span={8}>
            <DelSignupRecord
              onReload={onReload}
              roles={roles}
              signupRecords={signupRecords}
            />
          </Col>
          <Col span={8}>
            <BindRole onReload={onReload} />
          </Col>
          <Col span={8}>
            <EditRole roles={roles} onReload={onReload} />
          </Col>
          <Col span={8}>
            <UnbindRole roles={roles} onReload={onReload} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default UserCenter;
