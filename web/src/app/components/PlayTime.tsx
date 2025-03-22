import { CalendarFilled } from "@ant-design/icons";
import { Tooltip } from "antd";
import React, { useMemo } from "react";
import { useAppConfig } from "../player/context/appConfigContext";
import { UserInfo } from "../player/types";

function PlayTime(props: {
  play_time: UserInfo["play_time"];
  className?: string;
}) {
  const { play_time, className } = props;
  const { raidTimeNameMap, raidTimeOrderMap } = useAppConfig();

  const playTime = useMemo(() => {
    const formattedPlayTime = play_time.reduce((prev, time) => {
      const timeName = raidTimeNameMap.get(time);
      const timeOrder = raidTimeOrderMap.get(time);

      if (!timeName || !timeOrder) return prev;

      prev.push({
        timeName,
        timeOrder,
      });

      return prev;
    }, [] as { timeName: string; timeOrder: number }[]);

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
            return <div key={time.timeOrder}>{time.timeName}</div>;
          })}
        </>
      }
    >
      <CalendarFilled />
    </Tooltip>
  );
}

export default PlayTime;
