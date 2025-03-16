"use client";

import {
  Button,
  Col,
  Divider,
  message,
  Modal,
  Row,
  Select,
  Tooltip,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";

import ScrollWrap from "../../common/ScrollWrap";
import Actor from "../components/Actor";
import Players from "../components/Players";
import { InferArrayItem, PlayersData } from "@/app/types";
import { CalendarFilled, CloseOutlined } from "@ant-design/icons";
import { DAY_CN } from "@/app/common";
import { playersSortByTalent } from "@/app/utils";

type PlayerData = InferArrayItem<PlayersData>;
type PlayerPName = PlayerData["pname"];

function useRaidChange(
  players: PlayersData
): [(time: number, title: string) => Promise<PlayersData>, React.ReactNode] {
  const [messageApi, contextHolder] = message.useMessage();
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(0);
  const [title, setTitle] = useState("");
  const promise = useRef<(player: PlayersData) => void | null>(null);

  const openChangeModal = useCallback(
    (time: number, title: string): Promise<PlayersData> => {
      setIsOpen(true);
      setTime(time);
      setTitle(title);

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
    Record<PlayerPName, PlayersData>
  >({});

  //* 当前时间已安排的备用玩家
  const [reservesPlayers, setReservesPlayers] = useState<
    Record<PlayerPName, PlayersData>
  >({});

  useEffect(() => {
    //* 所有已经安排的玩家，用于过滤待安排的玩家
    const allAssigned = innerPlayers.filter((player) => {
      return player.group.length > 0;
    });

    const assigned = innerPlayers.filter((player) => {
      return player.group[1] === title;
    });
    playersSortByTalent(assigned);
    setAssignedPlayers(assigned);

    const unassigned = innerPlayers
      .filter((player) => {
        return (
          player.time.includes(time) && //报名时间包含当前时间
          player.group.length === 0 && //当前角色未分配
          !assigned.some((item) => item.pname === player.pname) &&
          !allAssigned.some((item) => item.cname === player.cname)
        );
      })
      .reduce((prev, item) => {
        prev[item.pname] ??= [];
        prev[item.pname].push(item);
        return prev;
      }, {} as Record<PlayerPName, PlayersData>);

    Object.values(unassigned).forEach((players) => {
      playersSortByTalent(players);
    });
    setUnassignedPlayers(unassigned);

    const reserves = innerPlayers
      .filter((player) => {
        return (
          player.time.includes(time) && //报名时间包含当前时间
          player.group.length === 0 && //当前角色未分配
          assigned.some((item) => item.pname === player.pname) &&
          !allAssigned.some((item) => item.cname === player.cname)
        );
      })
      .reduce((prev, item) => {
        prev[item.pname] ??= [];
        prev[item.pname].push(item);
        return prev;
      }, {} as Record<PlayerPName, PlayersData>);

    Object.values(reserves).forEach((players) => {
      playersSortByTalent(players);
    });
    setReservesPlayers(reserves);
  }, [innerPlayers, time, title]);

  function delPlayer(groupTitle: string, playerName: string) {
    const newData = innerPlayers.map((item) => {
      if (item.group[1] !== groupTitle) return item;
      if (item.name !== playerName) return item;

      item.group = [];
      return item;
    });

    setInnerPlayers(newData);
  }

  function addPlayer(player: PlayerData) {
    if (assignedPlayers.length === 25) {
      return messageApi.warning("当前团队已经满员，请移除现有团员后选择！");
    }

    const newData = innerPlayers.map((item) => {
      if (item.name === player.name && item.actor === player.actor) {
        item.group = [time, title];
      }
      return item;
    });

    setInnerPlayers(newData);
  }

  function changePlayer(oldPlayer: PlayerData, newPlayer: PlayerData) {
    const newData = innerPlayers.map((player) => {
      if (player.name === oldPlayer.name && player.actor === oldPlayer.actor) {
        player.group = [];
      }

      if (player.name === newPlayer.name && player.actor === newPlayer.actor) {
        player.group = [time, title];
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
          请编排<span className="inline-block mx-2">[ {title} ]</span>
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
              const reserves = reservesPlayers[item.pname];

              if (!reserves) {
                el = (
                  <div className="flex relative items-center justify-start w-full text-left pl-[11px]">
                    <Actor actor={item.actor} />
                    {/* // TODO 该处要修复 */}
                    <Players classes="DK">{item.name}</Players>
                  </div>
                );
              } else {
                const options = [item, ...reserves].map((item) => {
                  return {
                    value: JSON.stringify(item),
                    label: (
                      <>
                        <div className="flex relative items-center justify-start w-full text-left">
                          <Actor actor={item.actor} />
                          {/* // TODO 该处要修复 */}
                          <Players classes="SM">{item.name}</Players>
                        </div>
                      </>
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
                  key={`${item.name}-${item.actor}`}
                >
                  <Button block className="min-w-0">
                    {el}
                    <Tooltip
                      title={
                        <>
                          <div>报名时间：</div>
                          {item.time.map((time) => {
                            return <div key={time}>{DAY_CN[time]}</div>;
                          })}
                        </>
                      }
                    >
                      <CalendarFilled className="mx-1" />
                    </Tooltip>
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => delPlayer(title, item.name)}
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
                ([pname, players], index) => {
                  return (
                    <Col span={24} key={index}>
                      <Row>
                        <Col span={2}>
                          {pname}
                          <Tooltip
                            title={
                              <>
                                <div>报名时间：</div>
                                {players[0].time.map((time) => {
                                  return <div key={time}>{DAY_CN[time]}</div>;
                                })}
                              </>
                            }
                          >
                            <CalendarFilled className="ml-1 cursor-pointer" />
                          </Tooltip>
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
                                    <div className="flex relative items-center justify-start w-full text-left">
                                      <Actor actor={player.actor} />
                                      <Players classes="SM">
                                        {player.name}
                                      </Players>
                                    </div>
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
