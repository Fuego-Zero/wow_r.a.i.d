import Actor from "@/app/components/Actor";
import Players from "@/app/components/Players";
import { RoleClasses, TalentType } from "@/app/constant";
import React from "react";

type Props = {
  classes: RoleClasses;
  talent: TalentType[];
  name: string;
};

function Nameplate(props: Props) {
  const { classes, talent, name } = props;

  return (
    <div className="flex items-center space-x-2">
      <Actor actor={talent} />
      <Players classes={classes}>{name}</Players>
    </div>
  );
}

export default Nameplate;
