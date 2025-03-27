import { InferArrayItem } from "@yfsdk/web-basic-library";
import { RoleClasses, TalentType } from "../constant";
import { RoleType } from "../components/Role";

/**
 * 团队成员数据
 */
export type RaidData = {
  /**
   * 团队时间名称
   */
  group_title: GroupTitle;
  /**
   * 团队时间编号
   */
  group_time_key: GroupTimeKey;
  players: PlayersData;
}[];

/**
 * 玩家数据
 */
export type PlayersData = {
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

  /**
   * 是否已经安排
   */
  is_scheduled: boolean;
  assignment: RoleType;

  /**
   * 安排的参团时间的key
   */
  group_time_key: string;
  /**
   * 安排的参团时间的排序
   */
  group_time_order: number;
  /**
   * 参加的团队标题
   */
  group_title: string;
}[];

export type PlayerData = InferArrayItem<PlayersData>;
export type GroupTimeKey = InferArrayItem<PlayersData>["group_time_key"];
export type GroupTitle = InferArrayItem<PlayersData>["group_title"];

export type Handler = {
  delPlayer: (role_id: string) => void;
  selectPlayer: (
    group_time_key: GroupTimeKey,
    group_title: GroupTitle
  ) => Promise<void>;
  rosterPlayer: (
    group_time_key: GroupTimeKey,
    group_title: GroupTitle
  ) => Promise<void>;
  changeCharacterRole: (roleId: GroupTimeKey, role: RoleType) => Promise<void>;
  hoverTalent: (talent: TalentType[]) => void;
};
