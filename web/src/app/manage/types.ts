import * as types from "../player/types";

/**
 * 用户信息
 *
 * @description 用于后台管理，和前台用户信息不同
 */
export type UserInfo = Omit<types.UserInfo, "token"> & { id: string };
