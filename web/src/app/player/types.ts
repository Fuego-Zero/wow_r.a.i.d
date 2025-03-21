import { RoleClasses, TalentType } from "../constant";

export type UserInfo = {
  /**
   * 用户名
   */
  user_name: string;
  /**
   * 微信名
   */
  wechat_name: string;
  /**
   * 报名时间
   */
  play_time: string[];
  /**
   * 账号
   */
  account: string;
  /**
   * token
   */
  token: string;
  /**
   * 是否是管理员
   */
  is_admin: boolean;
};

export type RoleInfo = {
  /**
   * 角色名
   */
  role_name: string;
  /**
   * 角色职业
   */
  classes: RoleClasses;
  /**
   * 角色天赋
   */
  talent: TalentType[];
  /**
   * 是否自动报名
   */
  auto_signup: boolean;
  id: string;
};

export type RaidTime = {
  /**
   * 团本时间中文名
   */
  time_name: string;
  /**
   * 团本时间
   */
  time_key: string;
  /**
   * 团本时间排序
   */
  order: number;
};

export type SignupRecord = {
  id: string;

  /**
   * 角色ID
   */
  role_id: string;
  /**
   * 角色天赋
   */
  talent: TalentType[];
  /**
   * 角色职业
   */
  classes: RoleClasses;
  /**
   * 角色名
   */
  role_name: string;

  /**
   * 用户ID
   */
  user_id: string;
  /**
   * 游戏时间
   */
  play_time: string[];
  /**
   * 用户名
   */
  user_name: string;
};

export type WCLRank = {
  role_name: string;
  talent: TalentType;
  average_rank_percent: number;
  server_rank: number;
};
