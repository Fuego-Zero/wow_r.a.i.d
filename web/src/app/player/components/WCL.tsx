import { TalentType } from "@/app/constant";
import { Tooltip } from "antd";
import React, { memo } from "react";
import { useAppConfig } from "../context/appConfigContext";

type Props = {
  talent: TalentType[];
  role_name: string;
};

function WCL(props: Props) {
  const { talent, role_name } = props;
  const { WCLRanksMap } = useAppConfig();

  function color(rank: number) {
    if (rank < 25) return "#666666";
    if (rank < 50) return "#1eff00";
    if (rank < 75) return "#0070ff";
    if (rank < 95) return "#a335ee";
    if (rank < 99) return "#ff8000";
    if (rank < 100) return "#e268a8";
    if (rank === 100) return "#e5cc80";
  }

  return (
    <div className="flex flex-col">
      {talent.map((item) => {
        const key = role_name + item;
        const rank = WCLRanksMap.get(key);

        if (!rank) return null;

        return (
          <Tooltip
            key={key}
            title={`服务器排名：${rank.server_rank}`}
            placement="left"
          >
            <span
              className="wcl leading-none"
              style={{ color: color(rank.average_rank_percent) }}
            >
              {rank.average_rank_percent}
            </span>
          </Tooltip>
        );
      })}
    </div>
  );
}

export default memo(WCL) as typeof WCL;
