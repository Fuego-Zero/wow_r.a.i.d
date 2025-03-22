import { CalendarFilled } from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";
import { useAppConfig } from "../player/context/appConfigContext";
import { UserInfo } from "../player/types";

function PlayTime(props: { play_time: UserInfo["play_time"] }) {
  const { play_time } = props;
  const { raidTimeNameMap } = useAppConfig();

  return (
    <Tooltip
      title={
        <>
          <div>报名时间：</div>
          {play_time
            .map((time) => raidTimeNameMap.get(time))
            .map((time) => {
              return <div key={time}>{time}</div>;
            })}
        </>
      }
    >
      <CalendarFilled />
    </Tooltip>
  );
}

export default PlayTime;
