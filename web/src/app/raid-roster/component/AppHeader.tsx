"use client";

import { hiddenButtonClass } from "@/app/common";
import { App, Button } from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/player/context/authContext";
import axios from "axios";

function AppHeader(props: {
  reload: () => void;
  onCopy: () => Promise<void>;
  onDownload: () => Promise<void>;
  showAdvancedBtn: boolean;
}) {
  const { reload, onCopy, onDownload, showAdvancedBtn } = props;
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();

  async function submit() {
    try {
      setLoading(true);
      await axios.post("/api/roster");
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

  return (
    <div className="flex">
      <h1 className="flex-1">
        <span className="text-2xl text-amber-50">WOW R.A.I.D</span>
        <span className="ml-2">(Roster Auto-Integrated Deployment)</span>
      </h1>
      <div className={classNames(hiddenButtonClass, "space-x-5")}>
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
          <Button type="primary" onClick={submit} disabled={loading}>
            自动分配
          </Button>
        )}
        <Link href="/player">
          <Button type="link">个人中心</Button>
        </Link>
      </div>
    </div>
  );
}

export default AppHeader;
