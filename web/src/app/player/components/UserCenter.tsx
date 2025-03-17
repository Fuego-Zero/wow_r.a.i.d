import { Card, Col, Row, Tag } from "antd";
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

function UserCenter() {
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
  }

  useEffect(() => {
    onReload();
  }, []);

  const playTime = useMemo(() => {
    return (
      userInfo?.play_time
        .map((time) => raidTimeNameMap.get(time))
        .filter(Boolean) ?? []
    );
  }, [raidTimeNameMap, userInfo?.play_time]);

  return (
    <Row justify="center" className="!mx-0 mt-5" gutter={[16, 16]}>
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
                  {signupRecordSet.has(role.id) && (
                    <Tag color="cyan" className="ml-2 mr-0">
                      已报名
                    </Tag>
                  )}
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
