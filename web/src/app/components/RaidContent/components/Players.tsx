import React, { CSSProperties, useMemo } from "react";
import { TalentType, RoleClasses, ROLE_CLASSES_COLOR_MAP } from "../constant";

const actorToRoleMap: Record<TalentType, RoleClasses> = {
  FQ: "QS",
  CJQ: "QS",
  NQ: "QS",

  XDK: "DK",
  DKT: "DK",
  BDK: "DK",

  DS: "SM",
  NS: "SM",
  ZQS: "SM",

  AM: "MS",
  JLM: "MS",

  HF: "FS",
  BF: "FS",
  AF: "FS",

  EMS: "SS",
  TKS: "SS",

  SWL: "LR",
  SCL: "LR",

  CSZ: "DZ",
  ZDZ: "DZ",

  AC: "XD",
  ND: "XD",
  XT: "XD",
  YD: "XD",

  KBZ: "ZS",
  FZ: "ZS",

  EMPTY: "EMPTY",
};

function Players(props: { actor: TalentType } & React.PropsWithChildren) {
  const { actor, children } = props;

  const style = useMemo<CSSProperties>(() => {
    return {
      color: ROLE_CLASSES_COLOR_MAP[actorToRoleMap[actor]],
      flex: 1,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
    };
  }, [actor]);

  return <div style={style}>{children}</div>;
}

export default Players;
