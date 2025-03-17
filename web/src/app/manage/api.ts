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
