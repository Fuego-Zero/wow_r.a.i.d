"use client";

import classNames from "classnames";

import { toPng } from "html-to-image";
import {
  addPlayerSchedule,
  formatRaidData,
  htmlToPngDownload,
  removePlayerSchedule,
} from "@/app/utils";

import { Layout, App } from "antd";
import "@ant-design/v5-patch-for-react-19";
import { useAuth } from "../player/context/authContext";
import { useAppConfig } from "../player/context/appConfigContext";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getRaidRoster, postAutoRoster, saveRaidRoster } from "./api";
import {
  GroupTimeKey,
  GroupTitle,
  PlayerData,
  PlayersData,
  RaidData,
} from "./types";
import { isBizException } from "@yfsdk/web-basic-library";
import RaidContent from "./component/RaidContent";
import usePlayerSelect from "./hooks/usePlayerSelect";
import AppHeader from "./component/AppHeader";
import useRaidChange from "./hooks/useRaidChange";
import BaseProvider from "../components/common/BaseProvider";
import useUnassignedPlayers from "./hooks/useUnassignedPlayers";
import { RoleType } from "../components/Role";
import useGroupManage from "./hooks/useGroupManage";

function ScheduleContent() {
  const { message } = App.useApp();
  const { isAdmin } = useAuth();
  const { raidTimeOrderMap } = useAppConfig();

  const { notification } = App.useApp();
  const [playersData, setPlayersData] = useState<PlayersData>([]);
  const [isHiddenBtn, setIsHiddenBtn] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLoadPlayersData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getRaidRoster();
      setPlayersData(res);
    } catch (error) {
      if (isBizException(error)) {
        message.error(error.message);
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    onLoadPlayersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function setDataHandler(value: PlayersData) {
    try {
      await saveRaidRoster(value);
      setPlayersData(value);
    } catch (error) {
      if (isBizException(error)) return message.error(error.message);
      throw error;
    }
  }

  const el = useRef<HTMLElement>(null);

  async function invokeWithStyleReset(
    el: HTMLElement,
    task: () => Promise<void>
  ) {
    setIsHiddenBtn(true);

    const originalStyle = {
      overflow: window.getComputedStyle(el).overflow,
      height: window.getComputedStyle(el).height,
      maxHeight: window.getComputedStyle(el).maxHeight,
    };

    el.style.overflow = "visible";
    el.style.height = "auto";
    el.style.maxHeight = "none";

    await task();

    el.style.overflow = originalStyle.overflow;
    el.style.height = originalStyle.height;
    el.style.maxHeight = originalStyle.maxHeight;
    setIsHiddenBtn(false);
  }

  async function onCopy() {
    if (!el.current) return;
    const innerEl = el.current;

    invokeWithStyleReset(innerEl, async () => {
      const dataUrl = await toPng(innerEl, { cacheBust: true });
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      notification.success({
        message: "复制成功",
        description: "已将图片复制到剪贴板",
        duration: 1,
      });
    });
  }

  async function onDownload() {
    if (!el.current) return;
    const innerEl = el.current;

    invokeWithStyleReset(innerEl, async () => {
      await htmlToPngDownload(innerEl, new Date().toLocaleString());

      notification.success({
        message: "下载成功",
        description: "图片已成功下载",
        duration: 1,
      });
    });
  }

  const delPlayer = useCallback(
    (role_id: PlayerData["role_id"]) => {
      const newData = playersData.map((item) => {
        if (item.role_id !== role_id) return item;
        removePlayerSchedule(item);
        return item;
      });

      setDataHandler(newData);
    },
    [playersData]
  );

  const [openGroupManage, groupManageHolder, groupInfo] =
    useGroupManage(onLoadPlayersData);

  const raidData = useMemo<RaidData>(() => {
    const raidDataMap = formatRaidData(playersData).reduce((acc, item) => {
      acc.set(item.group_time_key, item.players);
      return acc;
    }, new Map<GroupTitle, PlayersData>());

    return groupInfo
      .filter((item) => item.enable)
      .map((item) => {
        const players = raidDataMap.has(item.time_key)
          ? raidDataMap.get(item.time_key)!
          : [];

        return {
          group_title: item.title,
          group_time_key: item.time_key,
          auto: item.auto,
          players,
        };
      });
  }, [groupInfo, playersData]);

  const [openSelectModal, selectModalContextHolder] =
    usePlayerSelect(playersData);

  const selectPlayer = useCallback(
    async (group_time_key: GroupTimeKey, group_title: GroupTitle) => {
      const player = await openSelectModal(group_time_key, group_title);

      playersData.forEach((item) => {
        if (
          player.user_id === item.user_id &&
          item.group_time_key === group_time_key
        ) {
          removePlayerSchedule(item);
        }
        if (item.role_id !== player.role_id) return;

        addPlayerSchedule(
          item,
          group_time_key,
          group_title,
          raidTimeOrderMap.get(group_time_key)!
        );
      });

      setDataHandler([...playersData]);
    },
    [openSelectModal, playersData, raidTimeOrderMap]
  );

  const changeCharacterRole = useCallback(
    async (roleId: PlayerData["role_id"], role: RoleType) => {
      playersData.forEach((item) => {
        if (item.role_id !== roleId) return;
        item.assignment = role;
      });
      setDataHandler([...playersData]);
    },
    [playersData]
  );

  const showAdvancedBtn = useMemo(() => {
    return raidData.length > 0;
  }, [raidData]);

  const [openChangeModal, raidChangeModalContextHolder] =
    useRaidChange(playersData);

  const rosterPlayer = useCallback(
    async (groupTimeKey: GroupTimeKey, groupTitle: string) => {
      const player = await openChangeModal(groupTimeKey, groupTitle);

      playersData.forEach((item) => {
        //* 清空当前时段的玩家
        if (item.group_time_key === groupTimeKey) removePlayerSchedule(item);

        if (
          player.some((_player) => {
            return _player.role_id === item.role_id;
          })
        ) {
          addPlayerSchedule(
            item,
            groupTimeKey,
            groupTitle,
            raidTimeOrderMap.get(groupTimeKey)!
          );
        }
      });

      setDataHandler([...playersData]);
    },
    [openChangeModal, playersData, raidTimeOrderMap]
  );

  const [openUnassignedModal, unassignedModalContextHolder] =
    useUnassignedPlayers(playersData);

  const autoRoster = useCallback(() => {
    const excludedTimeKeys: GroupTimeKey[] = [];
    const excludedRoleIds: string[] = [];

    raidData
      .filter((item) => !item.auto)
      .forEach((item) => {
        excludedTimeKeys.push(item.group_time_key);
        excludedRoleIds.push(
          ...item.players.map((player) => {
            return player.role_id;
          })
        );
      });

    return postAutoRoster({ excludedTimeKeys, excludedRoleIds });
  }, [raidData]);

  if (!isAdmin) return "再见";

  return (
    <>
      <Layout
        className={classNames(
          { "hidden-button": isHiddenBtn },
          "h-[100vh] flex overflow-auto"
        )}
        ref={el}
      >
        <Layout.Header className="sticky top-0 z-10 w-full">
          <AppHeader
            onCopy={onCopy}
            onDownload={onDownload}
            showAdvancedBtn={showAdvancedBtn}
            openUnassignedModal={openUnassignedModal}
            openGroupManage={openGroupManage}
            reload={onLoadPlayersData}
            autoRoster={autoRoster}
          />
        </Layout.Header>
        <Layout.Content>
          <RaidContent
            data={raidData}
            loading={loading}
            delPlayer={delPlayer}
            selectPlayer={selectPlayer}
            rosterPlayer={rosterPlayer}
            changeCharacterRole={changeCharacterRole}
          />
        </Layout.Content>
      </Layout>
      {selectModalContextHolder}
      {raidChangeModalContextHolder}
      {unassignedModalContextHolder}
      {groupManageHolder}
    </>
  );
}

export default function Schedule() {
  return (
    <BaseProvider>
      <ScheduleContent />
    </BaseProvider>
  );
}
