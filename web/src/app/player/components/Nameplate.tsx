import Actor from "@/app/components/Actor";
import Players from "@/app/components/Players";
import { RoleClasses, TalentType } from "@/app/constant";
import classNames from "classnames";
import React from "react";
import { useAppConfig } from "../context/appConfigContext";
import WCL from "./WCL";

type Props = {
  classes: RoleClasses;
  talent: TalentType[];
  name: string;
  className?: string;
};

function Nameplate(props: Props) {
  const { WCLRanksMap } = useAppConfig();
  const { classes, talent, name, className } = props;

  return (
    <div className={classNames("flex items-center mr-2", className)}>
      <Actor actor={talent} />
      <Players classes={classes}>{name}</Players>
      {talent.map((item) => {
        return (
          <WCL
            key={item}
            rank={WCLRanksMap.get(name + item)?.average_rank_percent}
          />
        );
      })}
    </div>
  );
}

export default Nameplate;
