import React from "react";
import AppUserMenu from "@/app/components/AppUserMenu";
import { App, Button } from "antd";
import { batchAddRecords } from "../api";
import { isBizException } from "@yfsdk/web-basic-library";
import AppTitle from "@/app/components/AppTitle";

export const Header = (props: { openCreateAccount: () => void }) => {
  const { message } = App.useApp();
  const { openCreateAccount } = props;

  async function addRecords() {
    try {
      const num = await batchAddRecords();
      message.success(`成功报名 ${num} 人`);
    } catch (error) {
      if (isBizException(error)) return message.error(error.message);
      console.error(error);
    }
  }

  return (
    <div className="flex items-center h-full space-x-2">
      <AppTitle title="管理后台" subTitle="" />
      <Button
        type="primary"
        onClick={() => {
          addRecords();
        }}
      >
        一键报名
      </Button>
      <Button
        type="primary"
        onClick={() => {
          openCreateAccount();
        }}
      >
        创建账号
      </Button>
      <AppUserMenu />
    </div>
  );
};
