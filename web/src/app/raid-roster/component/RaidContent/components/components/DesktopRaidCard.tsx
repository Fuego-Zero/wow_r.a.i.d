import { CloseOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import React from "react";
import Empty from "./Empty";
import Nameplate from "@/app/player/components/Nameplate";
import classNames from "classnames";
import { convertToMatrixIndex } from "../utils";
import { RaidPlayerCardsProps } from "../types";
import Role from "@/app/components/Role";

function DesktopRaidCard(props: RaidPlayerCardsProps) {
  const { data, displayMode, delPlayer, selectPlayer, players } = props;

  return (
    <div className="hidden md:flex md:flex-wrap">
      {players.map((item, index) => (
        <Card.Grid
          key={index}
          hoverable={false}
          style={{
            order: convertToMatrixIndex(index),
          }}
          className={classNames(
            "flex relative items-center justify-start py-1 px-1 min-w-0 w-[20%] min-h-[52px] group/delPlayer"
            // {
            //   "bg-amber-300/20": item.name === "空缺", //todo 未来针对暂缺情况的样式
            // }
          )}
        >
          {item.role_id ? (
            <>
              <Nameplate
                className="flex-1"
                classes={item.classes}
                role_name={item.role_name}
                user_name={item.user_name}
                talent={item.talent}
              />
              <Role
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3"
                role={item.assignment}
              />

              {!displayMode && (
                <Button
                  className="hidden group-hover/delPlayer:block absolute left-[-3px] top-[-3px]"
                  type="link"
                  size="small"
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => delPlayer?.(item.role_id)}
                />
              )}
            </>
          ) : (
            <Empty
              onClick={() => {
                if (displayMode) return;
                selectPlayer?.(data.group_time_key, data.group_title);
              }}
            />
          )}
        </Card.Grid>
      ))}
    </div>
  );
}

export default DesktopRaidCard;
