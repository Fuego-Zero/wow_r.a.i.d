import http from "../player/http";
import { PlayersData } from "./types";

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
