import { TalentType } from "@/app/constant";
import { Tooltip } from "antd";
import React, { memo } from "react";
import { useAppConfig } from "../context/appConfigContext";
import { getWClColor } from "@/app/utils";

type Props = {
  talent: TalentType[];
  role_name: string;
};

function WCL(props: Props) {
  const { talent, role_name } = props;
  const { WCLRanksMap } = useAppConfig();

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
              style={{ color: getWClColor(rank.average_rank_percent) }}
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
