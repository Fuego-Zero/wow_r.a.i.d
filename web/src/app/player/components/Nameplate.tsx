import Actor from "@/app/components/Actor";
import Players from "@/app/components/Players";
import { RoleClasses, TalentType } from "@/app/constant";
import classNames from "classnames";
import React, { memo, useMemo } from "react";
import WCL from "./WCL";
import { Tooltip } from "antd";

type Props = {
  classes: RoleClasses;
  talent: TalentType[];
  role_name: string;
  user_name?: string;
  className?: string;
};

function Nameplate(props: Props) {
  const { classes, talent, role_name, user_name, className } = props;

  const innerName = useMemo(() => {
    if (user_name === undefined) return role_name;
    return `${role_name} (${user_name})`;
  }, [role_name, user_name]);

  return (
    <div className={classNames("flex items-center min-w-0", className)}>
      <Actor actor={talent} />
      <Players classes={classes}>
        <Tooltip title={innerName}>{innerName}</Tooltip>
      </Players>
      <WCL role_name={role_name} talent={talent} />
    </div>
  );
}

export default memo(Nameplate);
