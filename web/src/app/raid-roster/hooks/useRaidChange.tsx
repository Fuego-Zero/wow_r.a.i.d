"use client";

import { Button, Col, Divider, message, Modal, Row, Select } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { CloseOutlined } from "@ant-design/icons";
import {
  addPlayerSchedule,
  playersSortByTalent,
  removePlayerSchedule,
} from "@/app/utils";
import { GroupTimeKey, PlayerData, PlayersData } from "../types";
import { useAppConfig } from "@/app/player/context/appConfigContext";
import Nameplate from "@/app/player/components/Nameplate";

import dynamic from "next/dynamic";
import PlayTime from "@/app/components/PlayTime";
const ScrollWrap = dynamic(() => import("@/app/components/common/ScrollWrap"), {
  ssr: false,
});

type PlayerUserName = PlayerData["user_name"];

function useRaidChange(
  players: PlayersData
): [
  (groupTimeKey: GroupTimeKey, groupTitle: string) => Promise<PlayersData>,
  React.ReactNode
] {
  const [messageApi, contextHolder] = message.useMessage();
  const [isOpen, setIsOpen] = useState(false);
  const [groupTimeKey, setGroupTimeKey] = useState<GroupTimeKey>("");
  const [groupTitle, setGroupTitle] = useState("");
  const { raidTimeOrderMap } = useAppConfig();
  const promise = useRef<(player: PlayersData) => void | null>(null);

  const openChangeModal = useCallback(
    (groupTimeKey: GroupTimeKey, groupTitle: string): Promise<PlayersData> => {
      setIsOpen(true);
      setGroupTimeKey(groupTimeKey);
      setGroupTitle(groupTitle);

      return new Promise((resolve) => {
        promise.current = resolve;
      });
    },
    []
  );

  //* 用于组件内部数据处理，避免直接修改 props
  const [innerPlayers, setInnerPlayers] = useState<PlayersData>([]);
  useEffect(() => {
    setInnerPlayers(JSON.parse(JSON.stringify(players)));
  }, [players]);

  //* 当前时间已安排的玩家
  const [assignedPlayers, setAssignedPlayers] = useState<PlayersData>([]);

  //* 当前时间待安排的玩家
  const [unassignedPlayers, setUnassignedPlayers] = useState<
    Record<PlayerUserName, PlayersData>
  >({});

  //* 当前时间已安排的备用玩家
  const [reservesPlayers, setReservesPlayers] = useState<
    Record<PlayerUserName, PlayersData>
  >({});

  useEffect(() => {
    //* 所有已经安排的玩家，用于过滤待安排的玩家
    const allAssigned = innerPlayers.filter((player) => {
      return player.is_scheduled;
    });

    const assigned = innerPlayers.filter((player) => {
      return player.group_time_key === groupTimeKey;
    });
    playersSortByTalent(assigned);
    setAssignedPlayers(assigned);

    const unassigned = innerPlayers
      .filter((player) => {
        return (
          player.play_time.includes(groupTimeKey) && //报名时间包含当前时间
          !player.is_scheduled && //当前角色未分配
          !assigned.some((item) => item.user_name === player.user_name) &&
          !allAssigned.some((item) => item.role_id === player.role_id)
        );
      })
      .reduce((prev, item) => {
        prev[item.user_name] ??= [];
        prev[item.user_name].push(item);
        return prev;
      }, {} as Record<PlayerUserName, PlayersData>);

    Object.values(unassigned).forEach((players) => {
      playersSortByTalent(players);
    });
    setUnassignedPlayers(unassigned);

    const reserves = innerPlayers
      .filter((player) => {
        return (
          player.play_time.includes(groupTimeKey) && //报名时间包含当前时间
          !player.is_scheduled && //当前角色未分配
          assigned.some((item) => item.user_name === player.user_name) &&
          !allAssigned.some((item) => item.role_id === player.role_id)
        );
      })
      .reduce((prev, item) => {
        prev[item.user_id] ??= [];
        prev[item.user_id].push(item);
        return prev;
      }, {} as Record<PlayerUserName, PlayersData>);

    Object.values(reserves).forEach((players) => {
      playersSortByTalent(players);
    });
    setReservesPlayers(reserves);
  }, [innerPlayers, groupTimeKey]);

  function delPlayer(role_id: PlayerData["role_id"]) {
    const newData = innerPlayers.map((item) => {
      if (item.group_time_key !== groupTimeKey) return item;
      if (item.role_id !== role_id) return item;
      removePlayerSchedule(item);
      return item;
    });

    setInnerPlayers(newData);
  }

  function addPlayer(player: PlayerData) {
    if (assignedPlayers.length === 25) {
      return messageApi.warning("当前团队已经满员，请移除现有团员后选择！");
    }

    const newData = innerPlayers.map((item) => {
      if (item.role_id === player.role_id) {
        addPlayerSchedule(
          item,
          groupTimeKey,
          groupTitle,
          raidTimeOrderMap.get(groupTimeKey)!
        );
      }

      return item;
    });

    setInnerPlayers(newData);
  }

  function changePlayer(oldPlayer: PlayerData, newPlayer: PlayerData) {
    const newData = innerPlayers.map((player) => {
      if (player.role_id === oldPlayer.role_id) removePlayerSchedule(player);

      if (player.role_id === newPlayer.role_id) {
        addPlayerSchedule(
          player,
          groupTimeKey,
          groupTitle,
          raidTimeOrderMap.get(groupTimeKey)!
        );
      }

      return player;
    });

    setInnerPlayers(newData);
  }

  function onOK() {
    setIsOpen(false);
    promise.current?.(assignedPlayers);
  }

  const Context = (
    <Modal
      title={
        <span>
          请编排<span className="inline-block mx-2">[ {groupTitle} ]</span>
          团成员
        </span>
      }
      maskClosable
      open={isOpen}
      width="90%"
      onCancel={() => {
        setIsOpen(false);
      }}
      centered
      onOk={onOK}
    >
      <div className="overflow-auto h-[80vh] flex flex-col">
        <div>
          <Divider orientation="left">已安排</Divider>
          <Row align="middle" className="!mx-0" gutter={[8, 8]}>
            {assignedPlayers.map((item) => {
              let el = null;
              const reserves = reservesPlayers[item.user_id];

              if (!reserves) {
                el = (
                  <Nameplate
                    classes={item.classes}
                    talent={item.talent}
                    role_name={item.role_name}
                    user_name={item.user_name}
                    className="w-full text-left pl-[11px]"
                  />
                );
              } else {
                const options = [item, ...reserves].map((item) => {
                  return {
                    value: JSON.stringify(item),
                    label: (
                      <Nameplate
                        classes={item.classes}
                        talent={item.talent}
                        role_name={item.role_name}
                        user_name={item.user_name}
                        className="w-full text-left"
                      />
                    ),
                  };
                });

                el = (
                  <Select
                    value={JSON.stringify(item)}
                    className="w-full"
                    options={options}
                    variant="borderless"
                    onChange={(value) => {
                      changePlayer(item, JSON.parse(value));
                    }}
                  />
                );
              }

              return (
                <div
                  className="w-[20%] px-[4px] h-[32px] flex items-center"
                  key={item.role_id}
                >
                  <Button block className="min-w-0">
                    {el}
                    <PlayTime play_time={item.play_time} />
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => delPlayer(item.role_id)}
                  />
                </div>
              );
            })}
          </Row>
          <Divider orientation="left">待安排</Divider>
        </div>
        <div className="flex-1 min-h-0">
          <ScrollWrap>
            <Row align="middle" className="!mx-0" gutter={[4, 4]}>
              {Object.entries(unassignedPlayers).map(
                ([user_name, players], index) => {
                  return (
                    <Col span={24} key={index}>
                      <Row>
                        <Col span={2}>
                          {user_name}
                          <PlayTime
                            play_time={players[0].play_time}
                            className="ml-1"
                          />
                        </Col>
                        <Col span={22}>
                          <Row gutter={[4, 4]}>
                            {players.map((player, index) => {
                              return (
                                <Col key={index} span={4}>
                                  <Button
                                    block
                                    onClick={() => {
                                      addPlayer(player);
                                    }}
                                  >
                                    <Nameplate
                                      classes={player.classes}
                                      talent={player.talent}
                                      role_name={player.role_name}
                                      user_name={player.user_name}
                                      className="w-full text-left"
                                    />
                                  </Button>
                                </Col>
                              );
                            })}
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  );
                }
              )}
            </Row>
          </ScrollWrap>
        </div>
      </div>
      {contextHolder}
    </Modal>
  );

  return [openChangeModal, Context];
}

export default useRaidChange;
