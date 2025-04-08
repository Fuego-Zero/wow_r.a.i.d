import { InferArrayItem } from "@yfsdk/web-basic-library";
import http from "../player/http";
import { UserInfo } from "./types";

export function getAllUsers(): Promise<UserInfo[]> {
  return http.get("/all_users");
}

export function resetPassword(
  userId: UserInfo["id"],
  password: string
): Promise<void> {
  return http.post("/reset_password", { password, targetUserId: userId });
}

export function batchAddRecords(): Promise<number> {
  return http.post("/raid/batch_add_records");
}

export function changeRoleDisableSchedule(
  roleId: InferArrayItem<UserInfo["roles"]>["id"],
  disableSchedule: boolean
): Promise<void> {
  return http.post("/role/change_role_disable_schedule", {
    id: roleId,
    disable_schedule: disableSchedule,
  });
}

export function createAccount(
  account: UserInfo["account"],
  user_name: UserInfo["user_name"]
): Promise<void> {
  return http.post("/create_account", { account, user_name });
}
