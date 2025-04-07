import { App, Tooltip } from "antd";
import React from "react";
import { RoleInfo } from "../types";
import { TwitterOutlined } from "@ant-design/icons";
import { leaveRaid } from "../api";
import { isBizException } from "@yfsdk/web-basic-library";

type Props = {
  id: RoleInfo["id"];
  onReload: () => Promise<void>;
};

function LeaveRaid(props: Props) {
  const { modal, message } = App.useApp();
  const { id, onReload } = props;

  async function confirm() {
    modal.confirm({
      title: "确定要当鸽子吗？",
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        try {
          await leaveRaid(id);
          message.success("解绑成功");
          onReload();
        } catch (error) {
          if (isBizException(error)) return message.error(error.message);
          message.error("解绑失败");
        }
      },
    });
  }

  return (
    <Tooltip title="我要当鸽子">
      <TwitterOutlined onClick={confirm} />
    </Tooltip>
  );
}

export default LeaveRaid;
