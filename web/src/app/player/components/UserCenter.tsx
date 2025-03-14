import { App, Button, Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import Actor from "@/app/components/RaidContent/components/Actor";
import Players from "@/app/components/RaidContent/components/Players";
import BindRole from "./BindRole";
import { getAllRole } from "../api";
import { RoleInfo } from "../types";
import UnbindRole from "./UnbindRole";

function UserCenter() {
  const { message } = App.useApp();
  const { userInfo } = useAuth();
  const [roles, setRoles] = useState<RoleInfo[]>([]);

  async function onReload() {
    const res = await getAllRole();
    setRoles(res);
  }

  useEffect(() => {
    onReload();
  }, []);

  return (
    <Row justify="center" className="!mx-0 mt-5" gutter={[16, 16]}>
      <Col span={24}>
        <Card
          title={`用户名：${userInfo?.user_name}`}
          size="small"
          extra={`微信名：${userInfo?.wechat_name}`}
        >
          <Card.Grid className="p-2 w-full" hoverable={false}>
            报名时间：{userInfo?.play_time.join("、")}
          </Card.Grid>
          {roles.map((role) => {
            return (
              <Card.Grid
                className="p-2 w-[50%]"
                hoverable={false}
                key={role.id}
              >
                <div className="flex relative items-center justify-start w-full text-left">
                  <Actor actor={role.talent} />
                  <Players classes={role.classes}>{role.role_name}</Players>
                  {/* <Tag color="cyan">已报名</Tag> */}
                </div>
              </Card.Grid>
            );
          })}
        </Card>
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Button block type="primary">
              立即报名
            </Button>
          </Col>
          <Col span={12}>
            <Button block type="dashed" danger>
              取消报名
            </Button>
          </Col>
          <Col span={12}>
            <BindRole onReload={onReload} />
          </Col>
          {/* <Col span={8}>
            <Button block type="dashed">
              修改角色
            </Button>
          </Col> */}
          <Col span={12}>
            <UnbindRole roles={roles} onReload={onReload} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default UserCenter;
