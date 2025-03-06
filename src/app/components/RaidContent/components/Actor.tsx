import React from "react";
import { ActorType, ActorMap } from "../constant";

function Actor(props: { actor: ActorType }) {
  const { actor } = props;

  let offset = 0;

  switch (actor) {
    // 德鲁伊
    case ActorMap.ACD:
      offset = 12;
      break;
    case ActorMap.ND:
      offset = 16;
      break;
    case ActorMap.YDT:
      offset = 15;
      break;
    case ActorMap.TD:
      offset = 14;
      break;

    // 死亡骑士
    case ActorMap.XDK:
      offset = 7;
      break;
    case ActorMap.DKT:
      offset = 1;
      break;
    case ActorMap.BDK:
      offset = 3;
      break;

    // 猎人
    case ActorMap.SWL:
      offset = 24;
      break;
    case ActorMap.SCL:
      offset = 28;
      break;

    // 法师
    case ActorMap.HF:
      offset = 31;
      break;
    case ActorMap.BF:
      offset = 32;
      break;
    case ActorMap.AF:
      offset = 30;
      break;

    // 牧师
    case ActorMap.AM:
      offset = 50;
      break;
    case ActorMap.JLM:
      offset = 47;
      break;

    // 圣骑士
    case ActorMap.FQ:
      offset = 43;
      break;
    case ActorMap.CJQ:
      offset = 44;
      break;
    case ActorMap.NQ:
      offset = 41;
      break;

    // 萨满
    case ActorMap.DS:
      offset = 60;
      break;
    case ActorMap.NS:
      offset = 62;
      break;
    case ActorMap.ZQS:
      offset = 61;
      break;

    // 盗贼
    case ActorMap.CSZ:
      offset = 53;
      break;
    case ActorMap.ZDZ:
      offset = 54;
      break;

    // 术士
    case ActorMap.EMS:
      offset = 68;
      break;
    case ActorMap.TKS:
      offset = 67;
      break;

    // 战士
    case ActorMap.KBZ:
      offset = 75;
      break;
    case ActorMap.FZ:
      offset = 78;
      break;
  }

  return (
    <div
      style={{
        backgroundImage: "url(/actors.jpg)",
        backgroundPosition: `-${offset * 36}px 0`,
        transform: "scale(0.5)",
        width: 36,
        height: 36,
      }}
    ></div>
  );
}

export default Actor;
