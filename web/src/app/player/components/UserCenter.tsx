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
import { SolutionOutlined, SyncOutlined } from "@ant-design/icons";
import { getPublishedSchedule } from "@/app/api";
import { isBizException } from "@yfsdk/web-basic-library";
import axios from "axios";

function UserCenter() {
  const { message, notification } = App.useApp();
  const { userInfo } = useAuth();
  const { raidTimeNameMap } = useAppConfig();
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

  async function syncWCL(roleName: RoleInfo["role_name"]) {
    try {
      await axios.post("/api/wcl_query", { role_name: roleName });
      message.success("同步 WCL 成功");
      onReload();
    } catch (error) {
      console.log(error);

      notification.error({
        message: "同步 WCL 失败",
        description: (error as Error).message,
      });
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
                  <div className="space-x-2 ml-2">
                    <Tooltip title="同步WCL">
                      <SyncOutlined
                        onClick={() => {
                          syncWCL(role.role_name);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="查看WCL">
                      <SolutionOutlined
                        className=""
                        onClick={() => {
                          window.open(
                            `https://cn.classic.warcraftlogs.com/character/cn/法琳娜/${role.role_name}`
                          );
                        }}
                      />
                    </Tooltip>
                    {signupRecordSet.has(role.id) && !schedule.get(role.id) && (
                      <Tag color="cyan" className="mr-0">
                        已报名
                      </Tag>
                    )}
                    {schedule.get(role.id) && (
                      <Tag color="green" className="mr-0">
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
          <Col span={12}>
            <AddSignupRecord
              onReload={onReload}
              roles={roles}
              signupRecords={signupRecordSet}
            />
          </Col>
          <Col span={12}>
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
