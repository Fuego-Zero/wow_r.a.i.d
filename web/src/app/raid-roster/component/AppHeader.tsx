"use client";

import { hiddenButtonClass } from "@/app/common";
import { App, Button } from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import { useAuth } from "@/app/player/context/authContext";
import { publishRaidRoster, saveRaidRoster, unpublishRaidRoster } from "../api";
import AppUserMenu from "@/app/components/AppUserMenu";

function AppHeader(props: {
  reload: () => void;
  onCopy: () => Promise<void>;
  onDownload: () => Promise<void>;
  openUnassignedModal: () => void;
  openGroupManage: () => void;
  autoRoster: () => Promise<void>;
  showAdvancedBtn: boolean;
}) {
  const {
    reload,
    onCopy,
    onDownload,
    openUnassignedModal,
    openGroupManage,
    autoRoster,
    showAdvancedBtn,
  } = props;
  const { notification, message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();

  async function publish() {
    try {
      await publishRaidRoster();
      message.success("发布成功");
      reload();
    } catch (error) {
      console.log(error);
      notification.error({
        message: "自动分配失败",
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function unpublish() {
    try {
      await unpublishRaidRoster();
      message.success("撤销成功");
      reload();
    } catch (error) {
      console.log(error);

      notification.error({
        message: "自动分配失败",
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function onAutoRoster() {
    try {
      setLoading(true);
      await autoRoster();
      reload();
    } catch (error) {
      notification.error({
        message: "自动分配失败",
        description: (error as Error).message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function clear() {
    try {
      setLoading(true);
      await saveRaidRoster([]);
      reload();
    } catch (error) {
      notification.error({
        message: "清空失败",
        description: (error as Error).message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex">
      <h1 className="flex-1 truncate min-w-0">
        <span className="text-base sm:text-lg md:text-xl lg:text-2xl text-amber-50">
          WOW R.A.I.D
        </span>
        <span className="ml-2">(Roster Auto-Integrated Deployment)</span>
      </h1>
      <div className={classNames(hiddenButtonClass, "space-x-2")}>
        {showAdvancedBtn && (
          <>
            <Button onClick={onDownload} disabled={loading}>
              下载全部
            </Button>
            <Button onClick={onCopy} disabled={loading}>
              复制全部
            </Button>
          </>
        )}
        {isAdmin && (
          <>
            <Button type="dashed" onClick={openGroupManage}>
              档期管理
            </Button>
            <Button type="dashed" onClick={openUnassignedModal}>
              未分配名单
            </Button>
            <Button type="primary" danger onClick={clear} disabled={loading}>
              清空排班
            </Button>
            <Button type="primary" onClick={publish} disabled={loading}>
              发布名单
            </Button>
            <Button type="primary" onClick={unpublish} disabled={loading}>
              撤销名单
            </Button>
            <Button type="primary" onClick={onAutoRoster} disabled={loading}>
              自动分配
            </Button>
          </>
        )}
        <AppUserMenu />
      </div>
    </div>
  );
}

export default AppHeader;
