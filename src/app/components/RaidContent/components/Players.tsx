import React, { CSSProperties, useMemo } from "react";
import { ActorType, CharacterClass, CharacterClassColorMap } from "../constant";

const actorToCharacterClassMap: Record<ActorType, CharacterClass> = {
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

function Players(props: { actor: ActorType } & React.PropsWithChildren) {
  const { actor, children } = props;

  const style = useMemo<CSSProperties>(() => {
    return {
      color: CharacterClassColorMap[actorToCharacterClassMap[actor]],
      flex: 1,
    };
  }, [actor]);

  return <div style={style}>{children}</div>;
}

export default Players;
