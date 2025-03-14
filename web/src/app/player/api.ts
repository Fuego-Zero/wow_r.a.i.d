import http from "./http";
import { RaidTime, RoleInfo, UserInfo } from "./types";

export function getUserInfo(): Promise<UserInfo> {
  return http.get("/user_info");
}

export function login(params: {
  account: string;
  password: string;
}): Promise<UserInfo> {
  return http.post("/login", params);
}

export function bindRole(params: {
  name: string;
  classes: string;
  talent: string[];
}): Promise<RoleInfo> {
  const { name, ...rest } = params;
  return http.post("/role/bind_role", { role_name: name, ...rest });
}

export function getAllRole(): Promise<RoleInfo[]> {
  return http.get("/role/get_all_role");
}

export function unbindRole(roleId: RoleInfo["id"]): Promise<void> {
  return http.post("/role/unbind_role", { id: roleId });
}

export function changePassword(password: string): Promise<void> {
  return http.post("/change_password", { password });
}

export function changeUserinfo(
  params: Omit<UserInfo, "token">
): Promise<Omit<UserInfo, "token">> {
  return http.post("/change_user_info", params);
}

export function getRaidTime(): Promise<RaidTime[]> {
  return http.get("/config/raid_time");
}
