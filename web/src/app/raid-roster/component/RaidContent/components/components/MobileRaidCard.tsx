import { Card } from "antd";
import React from "react";
import Empty from "./Empty";
import classNames from "classnames";
import { convertToMatrixIndex } from "../utils";
import { RaidPlayerCardsProps } from "../types";
import Players from "@/app/components/Players";
import Actor from "@/app/components/Actor";
import WCL from "@/app/player/components/WCL";
import Role from "@/app/components/Role";

function MobileRaidCard(props: RaidPlayerCardsProps) {
  const { displayMode, players } = props;

  return (
    <div className="flex flex-wrap md:hidden">
      {!displayMode
        ? "手机模式不支持编辑"
        : players.map((item, index) => (
            <Card.Grid
              key={index}
              hoverable={false}
              style={{
                order: convertToMatrixIndex(index),
              }}
              className={classNames(
                "flex relative items-center justify-start py-1 px-1 min-w-0 w-[20%] min-h-[70px]",
                {
                  "bg-amber-300/20": !item.role_id,
                }
              )}
            >
              {item.role_id ? (
                <div className="flex flex-col items-center justify-center w-full h-full space-y-1">
                  <div className="h-[18px] w-full flex items-center justify-between">
                    <Actor className="left-[-9px]" actor={item.talent} />
                    <Role width={18} height={18} role={item.assignment} />
                  </div>
                  <Players classes={item.classes}>
                    <span className="truncate text-[12px]">
                      {item.role_name}
                    </span>
                  </Players>
                  <div>
                    <WCL
                      role_name={item.role_name}
                      talent={item.talent}
                      mode="mobile"
                    />
                  </div>
                </div>
              ) : (
                <Empty />
              )}
            </Card.Grid>
          ))}
    </div>
  );
}

export default MobileRaidCard;
