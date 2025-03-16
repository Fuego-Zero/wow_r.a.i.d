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
