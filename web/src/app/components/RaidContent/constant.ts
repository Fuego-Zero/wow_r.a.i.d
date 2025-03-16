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
  SM = "SM", //神牧

  HF = "HF", //火法
  BF = "BF", //冰法
  AF = "AF", //奥法

  EMS = "EMS", //恶魔术
  TKS = "TKS", //痛苦术
  HMS = "HMS", //毁灭术

  SWL = "SWL", //兽王猎
  SCL = "SCL", //生存猎
  SJL = "SJL", //射击猎

  CSZ = "CSZ", //刺杀贼
  ZDZ = "ZDZ", //战斗贼
  MRZ = "MRZ", //敏锐贼

  AC = "AC", //鸟德
  ND = "ND", //奶德
  XT = "XT", //熊T
  YD = "YD", //猫德

  WQZ = "WQZ", //武器战
  KBZ = "KBZ", //狂暴战
  FZ = "FZ", //防战
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
};
