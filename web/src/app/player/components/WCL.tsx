import { TalentType } from "@/app/constant";
import { Tooltip } from "antd";
import React, { memo } from "react";
import { getWClColor } from "@/app/utils";
import classNames from "classnames";
import useWCLRanks from "@/app/raid-roster/hooks/useWCLRanks";

type Props = {
  talent: TalentType[];
  role_name: string;
  mode?: "mobile" | "desktop";
};

function WCL(props: Props) {
  const { talent, role_name, mode = "desktop" } = props;
  const { getWCLRank } = useWCLRanks();

  const _className = mode === "desktop" ? "flex-col" : "flex-row text-[12px]";

  return (
    <div className={classNames("flex", _className, mode)}>
      {talent.map((item, index) => {
        const rank = getWCLRank(role_name, item);

        if (!rank) return null;

        return (
          <Tooltip key={index} title={`服务器排名：${rank.server_rank}`}>
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
