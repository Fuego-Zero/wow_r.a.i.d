enum TalentMap {
  FQ = "FQ", //防骑
  CJQ = "CJQ", //惩戒骑
  NQ = "NQ", //奶骑

  XDK = "XDK", //邪DK
  DKT = "DKT", //血DK
  BDK = "BDK", //冰DK

  DS = "DS", //电萨
  NS = "NS", //奶萨
  ZQS = "ZQS", //增强萨

  AM = "AM", //暗牧
  JLM = "JLM", //戒律牧

  HF = "HF", //法师
  BF = "BF",
  AF = "AF",

  EMS = "EMS", //恶魔术
  TKS = "TKS", //痛苦术

  SWL = "SWL",
  SCL = "SCL", //猎人

  CSZ = "CSZ",
  ZDZ = "ZDZ", //盗贼

  AC = "AC", //鸟德
  ND = "ND", //奶德
  XT = "XT",
  YD = "YD", //猫德

  KBZ = "KBZ", //战士
  FZ = "FZ",

  EMPTY = "EMPTY", //空, 用于占位
}

export type TalentType = keyof typeof TalentMap;

enum RoleClassesMap {
  DK = "DK",
  XD = "XD",
  LR = "LR",
  FS = "FS",
  QS = "QS",
  MS = "MS",
  DZ = "DZ",
  SM = "SM",
  SS = "SS",
  ZS = "ZS",

  EMPTY = "EMPTY", //空, 用于占位
}

export type RoleClasses = keyof typeof RoleClassesMap;

export const ROLE_CLASSES_COLOR_MAP: Record<RoleClasses, string> = {
  DK: "#c41e3a",
  XD: "#ff7c0a",
  LR: "#aad372",
  FS: "#3fc7eb",
  QS: "#f48cba",
  MS: "#ffffff",
  DZ: "#fff468",
  SM: "#0070dd",
  SS: "#8788ee",
  ZS: "#c69b6d",
  EMPTY: "red",
};
