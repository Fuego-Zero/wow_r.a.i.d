import http from "./player/http";
import { PlayersData } from "./raid-roster/types";

export function getPublishedSchedule(): Promise<PlayersData> {
  return http.get("/schedule/published");
}
