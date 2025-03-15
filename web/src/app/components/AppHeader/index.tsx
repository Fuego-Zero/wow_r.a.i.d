"use client";

import { hiddenButtonClass } from "@/app/common";
import { PlayersData } from "@/app/types";
import { App, Button } from "antd";
import axios from "axios";
import classNames from "classnames";
import React, { useState } from "react";

function AppHeader(props: {
  setData: (value: PlayersData) => void;
  onCopy: () => Promise<void>;
  clearPlayersData: () => void;
  onDownload: () => Promise<void>;
  showAdvancedBtn: boolean;
}) {
  const { setData, onCopy, onDownload, clearPlayersData, showAdvancedBtn } =
    props;
  const [file, setFile] = useState<File>();
  const { message, notification } = App.useApp();
  const [loading, setLoading] = useState(false);

  function onUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls,.csv"; // 限制文件类型
    input.style.display = "none";

    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;

      const selectedFile = target.files[0];
      setFile(selectedFile);

      message.success(`文件 "${selectedFile.name}" 已选择`);

      document.body.removeChild(input);
    };

    document.body.appendChild(input);
    input.click();
  }

  async function submit() {
    try {
      if (!file) return message.error("请先上传名单");
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/v2/roster", formData);
      setData(res.data);
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
      <div className="mr-5">{file && file.name}</div>
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
        <Button
          onClick={() => {
            clearPlayersData();
            message.success("缓存已清理");
          }}
          type="dashed"
          disabled={loading}
        >
          清理缓存
        </Button>
        <Button onClick={onUpload} disabled={loading}>
          上传名单
        </Button>
        <Button type="primary" onClick={submit} disabled={loading}>
          自动分配
        </Button>
        <Link href="/player">
          <Button type="link">个人中心</Button>
        </Link>
      </div>
    </div>
  );
}
import Link from "next/link";
export default AppHeader;
