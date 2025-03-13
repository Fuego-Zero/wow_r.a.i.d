import { TalentType } from "./components/RaidContent/constant";

export type InferArrayItem<T> = T extends Array<infer P> ? P : never;

/**
 * 团队成员数据
 */
export type RaidData = {
  /**
   * 团队时间名称
   */
  title: string;
  /**
   * 团队时间编号
   */
  time: number;
  players: Array<{
    name: string;
    actor: TalentType;
  }>;
}[];

/**
 * 玩家数据
 */
export type PlayersData = {
  /**
   * 报名时间
   *
   * @description 1-7 代表周一到周日
   */
  time: number[];
  /**
   * 分配情况
   *
   * - [ 分配时间编号 , 分配时间名称 ]
   * @description 分配时间编号对应 time 报名时间
   */
  group: [number, string] | [];
  /**
   * 组合名称
   */
  name: string;
  /**
   * 微信昵称
   */
  pname: string;
  /**
   * 角色名称
   */
  cname: string;
  /**
   * 角色职业
   */
  actor: TalentType;
}[];

export type Handler = {
  delPlayer: (groupTitle: string, playerName: string) => void;
  selectPlayer: (time: number, title: string) => Promise<void>;
  rosterPlayer: (time: number, title: string) => Promise<void>;
};
