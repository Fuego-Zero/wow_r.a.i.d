export enum ActorMap {
  FQ = "FQ",
  CJQ = "CJQ",
  NQ = "NQ",

  XDK = "XDK",
  DKT = "DKT",
  BDK = "BDK",

  DS = "DS",
  NS = "NS",
  ZQS = "ZQS",

  AM = "AM",
  JLM = "JLM",

  HF = "HF",
  BF = "BF",
  AF = "AF",

  EMS = "EMS",
  TKS = "TKS",

  SWL = "SWL",
  SCL = "SCL",

  CSZ = "CSZ",
  ZDZ = "ZDZ",

  ACD = "ACD",
  ND = "ND",
  YDT = "YDT",
  TD = "TD",

  KBZ = "KBZ",
  FZ = "FZ",
}

export type ActorType = keyof typeof ActorMap;

export enum CharacterClassMap {
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

export type CharacterClass = keyof typeof CharacterClassMap;

export const CharacterClassColorMap: Record<CharacterClass, string> = {
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
