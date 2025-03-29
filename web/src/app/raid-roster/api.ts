import axios from "axios";
import http from "../player/http";
import { GroupInfo, GroupTimeKey, PlayersData } from "./types";

export function getRaidRoster(): Promise<PlayersData> {
  return http.get("/schedule/now");
}

export function saveRaidRoster(params: PlayersData): Promise<boolean> {
  params = params.filter((item) => item.is_scheduled);
  return http.post("/schedule/save", params);
}

export function publishRaidRoster(): Promise<boolean> {
  return http.post("/schedule/publish");
}

export function unpublishRaidRoster(): Promise<boolean> {
  return http.post("/schedule/unpublish");
}

export function getGroupInfo(): Promise<GroupInfo[]> {
  return http.get("/raid/get_group_info");
}

export function saveGroupInfo(params: GroupInfo[]): Promise<GroupInfo[]> {
  return http.post("/raid/save_group_info", params);
}

export async function postAutoRoster(params: {
  excludedRoleIds: string[];
  excludedTimeKeys: GroupTimeKey[];
}): Promise<void> {
  return axios.post("/api/roster", params);
}
