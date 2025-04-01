import { CalendarFilled } from "@ant-design/icons";
import { Tooltip } from "antd";
import React, { useMemo } from "react";
import { useAppConfig } from "../player/context/appConfigContext";
import { UserInfo } from "../player/types";
import classNames from "classnames";
import { InferArrayItem } from "@yfsdk/web-basic-library";

function PlayTime(props: {
  play_time: UserInfo["play_time"];
  className?: string;
  highlightTime?: UserInfo["play_time"];
  children?: React.ReactNode;
}) {
  const {
    play_time,
    className,
    highlightTime = [],
    children = <CalendarFilled />,
  } = props;
  const { raidTimeNameMap, raidTimeOrderMap } = useAppConfig();

  const playTime = useMemo(() => {
    const formattedPlayTime = play_time.reduce((prev, time) => {
      const timeName = raidTimeNameMap.get(time);
      const timeOrder = raidTimeOrderMap.get(time);

      if (!timeName || !timeOrder) return prev;

      prev.push({
        timeName,
        timeOrder,
        timeKey: time,
      });

      return prev;
    }, [] as { timeName: string; timeOrder: number; timeKey: InferArrayItem<UserInfo["play_time"]> }[]);

    formattedPlayTime.sort((a, b) => a.timeOrder - b.timeOrder);
    return formattedPlayTime;
  }, [play_time, raidTimeNameMap, raidTimeOrderMap]);

  return (
    <Tooltip
      className={className}
      title={
        <>
          <div>报名时间：</div>
          {playTime.map((time) => {
            return (
              <div
                key={time.timeOrder}
                className={classNames({
                  "text-blue-400": highlightTime.includes(time.timeKey),
                })}
              >
                {time.timeName}
              </div>
            );
          })}
        </>
      }
    >
      {children}
    </Tooltip>
  );
}

export default PlayTime;
