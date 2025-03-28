"use client";

import { Button, Col, Divider, Modal, Row, Switch } from "antd";
import React, { useCallback, useMemo, useState } from "react";

import { PlayerData, PlayersData } from "../types";
import Nameplate from "@/app/player/components/Nameplate";

import dynamic from "next/dynamic";
import useTalentSelect from "@/app/hooks/useTalentSelect";
import { playersSortByRoleAndTalent } from "@/app/utils";
import PlayTime from "@/app/components/PlayTime";
const ScrollWrap = dynamic(() => import("@/app/components/common/ScrollWrap"), {
  ssr: false,
});

type PlayerUserName = PlayerData["user_name"];

function useUnassignedPlayers(
  players: PlayersData
): [() => void, React.ReactNode] {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((): void => {
    setIsOpen(true);
  }, []);

  function onClose() {
    setIsOpen(false);
  }

  const [enableTalentSelect, setEnableTalentSelect] = useState(false);
  const [selectedActor, contextHolder] = useTalentSelect();

  const unassignedPlayers = useMemo(() => {
    const grouped = players
      .filter((player) => !player.is_scheduled)
      .filter((player) => {
        if (enableTalentSelect) return player.talent.includes(selectedActor);
        return true;
      })
      .reduce((acc, player) => {
        const { user_name } = player;
        acc[user_name] ??= [];
        acc[user_name].push(player);
        return acc;
      }, {} as Record<PlayerUserName, PlayerData[]>);

    Object.values(grouped).forEach(playersSortByRoleAndTalent);

    return grouped;
  }, [enableTalentSelect, players, selectedActor]);

  const assignedPlayers = useMemo(() => {
    const grouped = players
      .filter((player) => player.is_scheduled)
      .reduce((acc, player) => {
        const { user_name } = player;
        acc[user_name] ??= [];
        acc[user_name].push(player);
        return acc;
      }, {} as Record<PlayerUserName, PlayerData[]>);

    return grouped;
  }, [players]);

  const Holder = (
    <Modal
      title={
        <span className="flex items-center">
          当前 CD 未安排活动玩家与角色名单
          <span className="ml-20 flex items-center">
            <span>按天赋筛选：</span>
            <Switch
              value={enableTalentSelect}
              onChange={() => {
                setEnableTalentSelect(!enableTalentSelect);
              }}
            />
          </span>
        </span>
      }
      maskClosable
      open={isOpen}
      width="90%"
      onCancel={onClose}
      centered
      footer={null}
      onOk={onClose}
    >
      <div className="overflow-auto h-[80vh] flex flex-col">
        <div>
          <Row align="middle" className="!mx-0" gutter={[8, 8]}>
            {enableTalentSelect && contextHolder}
            <Divider className="mt-0 mb-2"></Divider>
          </Row>
        </div>
        <div className="flex-1 min-h-0">
          <ScrollWrap>
            <Row align="middle" className="!mx-0" gutter={[4, 4]}>
              {Object.entries(unassignedPlayers).map(
                ([user_name, players], index) => {
                  const assigned = assignedPlayers[user_name] ?? [];
                  const assignedTime = assigned.map(
                    (player) => player.group_time_key
                  );

                  return (
                    <Col span={24} key={index}>
                      <Row>
                        <Col span={3}>
                          {user_name}
                          <span
                            className="mx-1 text-blue-400"
                            title="已安排/总数"
                          >
                            ({assigned.length}/
                            {assigned.length + players.length})
                          </span>
                          <PlayTime
                            play_time={players[0].play_time}
                            className="ml-1"
                            highlightTime={assignedTime}
                          />
                        </Col>
                        <Col span={21}>
                          <Row gutter={[4, 4]}>
                            {players.map((player, index) => {
                              return (
                                <Col key={index} span={4}>
                                  <Button block>
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
    </Modal>
  );

  return [open, Holder];
}

export default useUnassignedPlayers;
