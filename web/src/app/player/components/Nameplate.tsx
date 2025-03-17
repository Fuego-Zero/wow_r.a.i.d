import Actor from "@/app/components/Actor";
import Players from "@/app/components/Players";
import { RoleClasses, TalentType } from "@/app/constant";
import classNames from "classnames";
import React, { useMemo } from "react";
import { useAppConfig } from "../context/appConfigContext";
import WCL from "./WCL";

type Props = {
  classes: RoleClasses;
  talent: TalentType[];
  role_name: string;
  user_name?: string;
  className?: string;
};

function Nameplate(props: Props) {
  const { WCLRanksMap } = useAppConfig();
  const { classes, talent, role_name, user_name, className } = props;

  const innerName = useMemo(() => {
    if (user_name === undefined) return role_name;
    return `${role_name} (${user_name})`;
  }, [role_name, user_name]);

  return (
    <div className={classNames("flex items-center", className)}>
      <Actor actor={talent} />
      <Players classes={classes}>{innerName}</Players>
      {talent.map((item) => {
        return (
          <WCL
            key={item}
            rank={WCLRanksMap.get(role_name + item)?.average_rank_percent}
            serverRank={WCLRanksMap.get(role_name + item)?.server_rank}
          />
        );
      })}
    </div>
  );
}

export default Nameplate;
