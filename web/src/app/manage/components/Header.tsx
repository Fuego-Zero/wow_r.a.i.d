import React from "react";
import AppUserMenu from "@/app/components/AppUserMenu";
import { App, Button } from "antd";
import { batchAddRecords } from "../api";
import { isBizException } from "@yfsdk/web-basic-library";

export const Header = () => {
  const { message } = App.useApp();

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
      <span className="flex-1 text-xl">管理后台</span>
      <Button
        type="primary"
        onClick={() => {
          addRecords();
        }}
      >
        一键报名
      </Button>
      <AppUserMenu />
    </div>
  );
};
