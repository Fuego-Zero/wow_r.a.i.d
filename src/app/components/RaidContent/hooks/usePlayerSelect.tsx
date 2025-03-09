"use client";

import { Button, ButtonProps, Col, Divider, Modal, Row, Tooltip } from "antd";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActorType } from "../constant";

const TANK: ActorType[] = ["FQ", "DKT"];
const HEALER: ActorType[] = ["NS", "NQ", "JLM", "ND"];
const DPS: ActorType[] = [
  "SCL",
  "CSZ",
  "ZDZ",
  "AC",
  "YD",
  "KBZ",
  "HF",
  "EMS",
  "TKS",
  "DS",
  "ZQS",
  "AM",
  "CJQ",
  "XDK",
  "BDK",
];

import ScrollWrap from "../../common/ScrollWrap";
import Actor from "../components/Actor";
import Players from "../components/Players";
import { InferArrayItem, PlayersData } from "@/app/types";
import { CalendarFilled, PushpinFilled } from "@ant-design/icons";
import { DAY_CN } from "@/app/common";

type PlayerData = InferArrayItem<PlayersData>;

function usePlayerSelect(
  players: PlayersData
): [(time: number, title: string) => Promise<PlayerData>, React.ReactNode] {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedActor, setSelectedActor] = useState<ActorType>("FQ");

  const isSelectProps: ButtonProps = {
    color: "primary",
    variant: "outlined",
  };

  function onSelectActor(actor: ActorType) {
    setSelectedActor(actor);
  }

  function onSelectPlayer(player: PlayerData) {
    setIsOpen(false);
    promise.current?.(player);
  }

  const [time, setTime] = useState(0);
  const [title, setTitle] = useState("");
  const promise = useRef<(player: PlayerData) => void | null>(null);

  const openSelectModal = useCallback(
    (time: number, title: string): Promise<PlayerData> => {
      setIsOpen(true);
      setTime(time);
      setTitle(title);

      return new Promise((resolve) => {
        promise.current = resolve;
      });
    },
    []
  );

  const innerPlayers = useMemo(() => {
    return players.filter((player) => {
      if (!player.time.includes(time)) return false;
      return player.actor === selectedActor || selectedActor === "EMPTY";
    });
  }, [players, selectedActor, time]);

  const Context = (
    <Modal
      title={
        <span>
          请选择<span className="inline-block mx-2">[ {title} ]</span>
          团成员
        </span>
      }
      maskClosable
      open={isOpen}
      footer={null}
      width="70%"
      onCancel={() => {
        setIsOpen(false);
      }}
    >
      <Row align="middle" className="space-x-2" gutter={[0, 8]}>
        <span>坦克</span>
        {TANK.map((item) => {
          return (
            <Button
              key={item}
              icon={<Actor actor={item} />}
              {...(selectedActor === item ? isSelectProps : {})}
              onClick={() => {
                onSelectActor(item);
              }}
            />
          );
        })}
        <span>治疗</span>
        {HEALER.map((item) => {
          return (
            <Button
              key={item}
              icon={<Actor actor={item} />}
              {...(selectedActor === item ? isSelectProps : {})}
              onClick={() => {
                onSelectActor(item);
              }}
            />
          );
        })}
        <span>输出</span>
        {DPS.map((item) => {
          return (
            <Button
              key={item}
              icon={<Actor actor={item} />}
              {...(selectedActor === item ? isSelectProps : {})}
              onClick={() => {
                onSelectActor(item);
              }}
            />
          );
        })}
        {/* 目前全量数据太多了，会渲染卡顿，暂时关闭 */}
        {/* <Button
          onClick={() => {
            onSelectActor("EMPTY");
          }}
        >
          全部
        </Button> */}
      </Row>
      <Divider className="my-4" />
      <div className="overflow-auto h-[60vh]">
        <ScrollWrap>
          <Row align="middle" className="!mx-0" gutter={[8, 8]}>
            {innerPlayers.map((player, index) => {
              const filtered = players.filter((item) => {
                return item.name === player.name && item.group.length > 0;
              });

              let el = null;
              if (player.group.length > 0 && filtered.length === 1) {
                //* 当前天赋有分配时间，且其他天赋无分配
                el = (
                  <Tooltip title={`分配时间：${player.group[1]}`}>
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
                          key={player.group[1]}
                          className="flex items-center"
                        >
                          <Actor actor={player.actor} />
                          {player.group[1]}
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
                      <Actor actor={player.actor} />
                      <Players actor={player.actor}>{player.name}</Players>
                      {el}
                      <Tooltip
                        title={
                          <>
                            <div>报名时间：</div>
                            {player.time.map((time) => {
                              return <div key={time}>{DAY_CN[time]}</div>;
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
