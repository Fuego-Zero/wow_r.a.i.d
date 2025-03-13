import http from "./http";
import { RoleInfo, UserInfo } from "./types";

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
  return http.post("/bind_role", { role_name: name, ...rest });
}

export function getAllRole(): Promise<RoleInfo[]> {
  return http.get("/get_all_role");
}

export function unbindRole(roleId: RoleInfo["id"]): Promise<void> {
  return http.post("/unbind_role", { id: roleId });
}
