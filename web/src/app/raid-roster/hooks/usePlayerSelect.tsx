"use client";

import { Button, Col, Divider, Modal, Row, Tooltip } from "antd";
import React, { useCallback, useMemo, useRef, useState } from "react";

import { CalendarFilled, PushpinFilled } from "@ant-design/icons";
import { GroupTimeKey, GroupTitle, PlayerData, PlayersData } from "../types";
import Actor from "@/app/components/Actor";
import ScrollWrap from "@/app/components/common/ScrollWrap";
import { useAppConfig } from "@/app/player/context/appConfigContext";
import Nameplate from "@/app/player/components/Nameplate";
import useTalentSelect from "@/app/hooks/useTalentSelect";

function usePlayerSelect(
  players: PlayersData
): [
  (
    group_time_key: GroupTimeKey,
    group_title: GroupTitle
  ) => Promise<PlayerData>,
  React.ReactNode
] {
  const [isOpen, setIsOpen] = useState(false);
  const { raidTimeNameMap } = useAppConfig();

  function onSelectPlayer(player: PlayerData) {
    setIsOpen(false);
    promise.current?.(player);
  }

  const [groupTimeKey, setGroupTimeKey] = useState<GroupTimeKey>("");
  const [groupTitle, setGroupTitle] = useState("");
  const promise = useRef<(player: PlayerData) => void | null>(null);

  const openSelectModal = useCallback(
    (
      group_time_key: GroupTimeKey,
      group_title: GroupTitle
    ): Promise<PlayerData> => {
      setIsOpen(true);
      setGroupTimeKey(group_time_key);
      setGroupTitle(group_title);

      return new Promise((resolve) => {
        promise.current = resolve;
      });
    },
    []
  );

  const [selectedActor, contextHolder] = useTalentSelect();

  const innerPlayers = useMemo(() => {
    return players.filter((player) => {
      return (
        player.talent.includes(selectedActor) &&
        player.play_time.includes(groupTimeKey)
      );
    });
  }, [players, selectedActor, groupTimeKey]);

  const Context = (
    <Modal
      title={
        <span>
          请选择<span className="inline-block mx-2">[ {groupTitle} ]</span>
          团成员
        </span>
      }
      maskClosable
      open={isOpen}
      footer={null}
      width="90%"
      onCancel={() => {
        setIsOpen(false);
      }}
    >
      {contextHolder}
      <Divider className="my-4" />
      <div className="overflow-auto h-[60vh]">
        <ScrollWrap>
          <Row align="middle" className="!mx-0" gutter={[8, 8]}>
            {innerPlayers.map((player, index) => {
              //* 过滤当前角色在整个CD的分配情况
              const filtered = players.filter((item) => {
                return item.role_id === player.role_id && item.is_scheduled;
              });

              let el = null;
              if (player.is_scheduled && filtered.length === 1) {
                //* 当前天赋有分配时间，且其他天赋无分配
                el = (
                  <Tooltip title={`分配时间：${player.group_title}`}>
                    <PushpinFilled className="mr-1" />
                  </Tooltip>
                );
              } else if (filtered.length > 0) {
                //* 不论当前天赋是否有分配时间，考虑其他天赋有分配
                const title = (
                  <>
                    <div>分配时间：</div>
                    {filtered.map((player) => {
                      return (
                        <div
                          key={player.group_time_key}
                          className="flex items-center"
                        >
                          <Actor actor={player.talent} />
                          {raidTimeNameMap.get(player.group_time_key)}
                        </div>
                      );
                    })}
                  </>
                );

                el = (
                  <Tooltip title={title}>
                    <PushpinFilled className="mr-1" />
                  </Tooltip>
                );
              }

              return (
                <Col xs={24} sm={12} md={8} xl={6} xxl={4} key={index}>
                  <Button
                    block
                    onClick={() => {
                      onSelectPlayer(player);
                    }}
                  >
                    <div className="flex relative items-center justify-start w-full text-left">
                      <Nameplate
                        classes={player.classes}
                        talent={player.talent}
                        role_name={player.role_name}
                        user_name={player.user_name}
                        className="w-full min-w-0 mr-1"
                      />

                      {el}
                      <Tooltip
                        title={
                          <>
                            <div>报名时间：</div>
                            {player.play_time
                              .map((time) => raidTimeNameMap.get(time))
                              .map((time) => {
                                return <div key={time}>{time}</div>;
                              })}
                          </>
                        }
                      >
                        <CalendarFilled />
                      </Tooltip>
                    </div>
                  </Button>
                </Col>
              );
            })}
          </Row>
        </ScrollWrap>
      </div>
    </Modal>
  );

  return [openSelectModal, Context];
}

export default usePlayerSelect;
