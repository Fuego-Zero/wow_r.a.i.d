import Actor from "@/app/components/RaidContent/components/Actor";
import { App, Button, Card, Modal, Popconfirm } from "antd";
import React, { useState } from "react";
import { RoleInfo } from "../types";
import Players from "@/app/components/RaidContent/components/Players";
import { DisconnectOutlined } from "@ant-design/icons";
import { unbindRole } from "../api";

type Props = {
  roles: RoleInfo[];
  onReload: () => Promise<void>;
};

function UnbindRole(props: Props) {
  const { roles } = props;
  const { message } = App.useApp();
  const [isOpen, setIsOpen] = useState(false);

  function onClose() {
    setIsOpen(false);
    props.onReload();
  }

  async function confirm(roleId: RoleInfo["id"]) {
    await unbindRole(roleId);
    message.success("解绑成功");
    props.onReload();
  }

  return (
    <>
      <Button block type="dashed" onClick={() => setIsOpen(true)}>
        解绑角色
      </Button>
      <Modal
        open={isOpen}
        title="解绑角色"
        footer={false}
        destroyOnClose
        onCancel={onClose}
      >
        <Card title="角色列表" size="small">
          {roles.map((role) => {
            return (
              <Card.Grid
                className="p-2 w-[50%]"
                hoverable={false}
                key={role.id}
              >
                <div className="flex relative items-center justify-start w-full text-left">
                  <Actor actor={role.talent[0]} />
                  <Players actor={role.talent[0]}>{role.role_name}</Players>
                  <Popconfirm
                    title="是否确认解绑"
                    onConfirm={() => {
                      confirm(role.id);
                    }}
                  >
                    <Button type="text" icon={<DisconnectOutlined />} danger />
                  </Popconfirm>
                </div>
              </Card.Grid>
            );
          })}
        </Card>
      </Modal>
    </>
  );
}

export default UnbindRole;
