import { CloseOutlined, TwitterOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, MenuProps, Tooltip } from "antd";
import React from "react";
import Empty from "./Empty";
import Nameplate from "@/app/player/components/Nameplate";
import classNames from "classnames";
import { convertToMatrixIndex } from "../utils";
import { RaidPlayerCardsProps } from "../types";
import Role, { RoleType } from "@/app/components/Role";

const items: MenuProps["items"] = [
  {
    label: (
      <div className="flex items-center space-x-2">
        <Role role="TANK" />
        <span>坦克</span>
      </div>
    ),
    key: "TANK",
  },
  {
    label: (
      <div className="flex items-center space-x-2">
        <Role role="DPS" />
        <span>输出</span>
      </div>
    ),
    key: "DPS",
  },
  {
    label: (
      <div className="flex items-center space-x-2">
        <Role role="HEALER" />
        <span>治疗</span>
      </div>
    ),
    key: "HEALER",
  },
];

function DesktopRaidCard(props: RaidPlayerCardsProps) {
  const {
    data,
    displayMode,
    delPlayer,
    selectPlayer,
    changeCharacterRole,
    players,
    hoverTalent,
  } = props;

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
            "flex relative items-center justify-start py-1 px-1 min-w-0 w-[20%] min-h-[52px] group/delPlayer",
            {
              "bg-amber-300/20": !item.role_id,
              "bg-red-600/20": item.is_leave,
            },
            item.talent.join(" ")
          )}
          onMouseEnter={() => {
            hoverTalent(item.talent);
          }}
          onMouseLeave={() => {
            hoverTalent([]);
          }}
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

              <Dropdown
                menu={{
                  items,
                  selectable: true,
                  defaultSelectedKeys: [item.assignment],
                  onClick: ({ key }) => {
                    changeCharacterRole?.(item.role_id, key as RoleType);
                  },
                }}
                disabled={displayMode}
                destroyPopupOnHide
                trigger={["contextMenu"]}
              >
                <div>
                  <Role
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3"
                    role={item.assignment}
                  />
                </div>
              </Dropdown>

              {item.is_leave && (
                <Tooltip title="这是个鸽子">
                  <TwitterOutlined className="ml-2" />
                </Tooltip>
              )}

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
