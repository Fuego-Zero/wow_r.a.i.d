import React, { CSSProperties } from "react";
import { TalentType } from "../constant";

import { isArray } from "@yfsdk/web-basic-library";

function getOffset(actor: TalentType) {
  let offset = 0;
  switch (actor) {
    // 德鲁伊
    case "AC":
      offset = 12;
      break;
    case "ND":
      offset = 16;
      break;
    case "XT":
      offset = 15;
      break;
    case "YD":
      offset = 14;
      break;

    // 死亡骑士
    case "XDK":
      offset = 7;
      break;
    case "DKT":
      offset = 1;
      break;
    case "BDK":
      offset = 3;
      break;

    // 猎人
    case "SWL":
      offset = 24;
      break;
    case "SCL":
      offset = 28;
      break;
    case "SJL":
      offset = 25;
      break;

    // 法师
    case "HF":
      offset = 31;
      break;
    case "BF":
      offset = 32;
      break;
    case "AF":
      offset = 30;
      break;

    // 牧师
    case "SM":
      offset = 49;
      break;
    case "AM":
      offset = 50;
      break;
    case "JLM":
      offset = 47;
      break;

    // 圣骑士
    case "FQ":
      offset = 43;
      break;
    case "CJQ":
      offset = 44;
      break;
    case "NQ":
      offset = 41;
      break;

    // 萨满
    case "DS":
      offset = 60;
      break;
    case "NS":
      offset = 62;
      break;
    case "ZQS":
      offset = 61;
      break;

    // 盗贼
    case "MRZ":
      offset = 57;
      break;
    case "CSZ":
      offset = 53;
      break;
    case "ZDZ":
      offset = 54;
      break;

    // 术士
    case "HMS":
      offset = 69;
      break;
    case "EMS":
      offset = 68;
      break;
    case "TKS":
      offset = 67;
      break;

    // 战士
    case "WQZ":
      offset = 73;
      break;
    case "KBZ":
      offset = 75;
      break;
    case "FZ":
      offset = 78;
      break;
  }

  return offset;
}

const style: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: `url("/images/actors.jpg")`,
};

function Actor(props: { actor: TalentType[] | TalentType }) {
  const { actor } = props;

  let actor1;
  let actor2;

  if (isArray(actor)) {
    [actor1, actor2] = actor;
  } else {
    actor1 = actor;
    actor2 = actor;
  }

  const offset = getOffset(actor1);
  const offset2 = getOffset(actor2);

  return (
    <div
      className="relative"
      style={{
        transform: "scale(0.5)",
        width: 36,
        height: 36,
      }}
    >
      <div
        style={{
          ...style,
          backgroundPosition: `-${offset * 36}px 0`,
          clipPath: "polygon(0% 0%, 0% 100%, 100% 0%)",
        }}
      />
      <div
        style={{
          ...style,
          backgroundPosition: `-${
            (actor2 === undefined ? offset : offset2) * 36
          }px 0`,
          clipPath: "polygon( 0% 100%,100% 100%, 100% 0%)",
        }}
      />
    </div>
  );
}

export default Actor;
