import { RoleClasses, TalentType } from "../components/RaidContent/constant";

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
