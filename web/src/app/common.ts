import { RoleType } from "./components/Role";
import { TalentType } from "./constant";

export const hiddenButtonClass = "[.hidden-button_&]:hidden";

export const DAY_ORDER = [4, 5, 6, 7, 1, 2, 3];

export const DAY_CN: Record<number, string> = {
  4: "周四",
  5: "周五",
  6: "周六",
  7: "周日",
  1: "周一",
  2: "周二",
  3: "周三",
};

export const ACTOR_ORDER: TalentType[] = [
  "FQ",
  "DKT",
  "FZ",
  "XT",

  "CJQ",
  "XDK",
  "BDK",
  "DS",
  "ZQS",
  "AM",
  "HF",
  "BF",
  "AF",
  "EMS",
  "TKS",
  "HMS",
  "SWL",
  "SCL",
  "SJL",
  "CSZ",
  "ZDZ",
  "MRZ",
  "AC",
  "YD",
  "WQZ",
  "KBZ",

  "NS",
  "NQ",
  "JLM",
  "SM",
  "ND",
];

export const ROLE_ORDER: RoleType[] = ["TANK", "DPS", "HEALER"];
