import { toPng } from "html-to-image";
import { ACTOR_ORDER, ROLE_ORDER } from "../common";
import {
  GroupTimeKey,
  PlayerData,
  PlayersData,
  RaidData,
} from "../raid-roster/types";

export async function htmlToPngDownload(el: HTMLElement, name: string) {
  const dataUrl = await toPng(el, { cacheBust: true });

  const link = document.createElement("a");
  link.download = `团本安排_${name}.png`;
  link.href = dataUrl;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function playersSortByRoleAndTalent(players: PlayersData) {
  players.sort((a, b) => {
    const roleA = ROLE_ORDER.indexOf(a.assignment);
    const roleB = ROLE_ORDER.indexOf(b.assignment);

    if (roleA !== roleB) return roleA - roleB;

    const talentA = ACTOR_ORDER.indexOf(a.talent[0]);
    const talentB = ACTOR_ORDER.indexOf(b.talent[0]);
    return talentA - talentB;
  });
}

export function playersSortByOrder(players: PlayersData) {
  players.sort((a, b) => {
    return a.group_time_order - b.group_time_order;
  });
}

export function removePlayerSchedule(item: PlayerData) {
  item.group_time_key = "";
  item.group_time_order = -1;
  item.group_title = "";
  item.is_scheduled = false;
}

export function addPlayerSchedule(
  item: PlayerData,
  group_time_key: PlayerData["group_time_key"],
  group_title: PlayerData["group_title"],
  group_time_order: PlayerData["group_time_order"]
) {
  item.group_time_key = group_time_key;
  item.group_title = group_title;
  item.group_time_order = group_time_order;
  item.is_scheduled = true;
}

export function formatRaidData(playersData: PlayersData): RaidData {
  const data: RaidData = [];

  playersSortByOrder(playersData);

  const groupedPlayers = playersData.reduce((prev, item) => {
    if (!item.is_scheduled) return prev;

    const key = item.group_time_key;
    prev[key] ??= [];
    prev[key].push(item);

    return prev;
  }, {} as Record<GroupTimeKey, PlayersData>);

  Object.values(groupedPlayers).forEach(playersSortByRoleAndTalent);

  Object.entries(groupedPlayers).forEach(([key, value]) => {
    data.push({
      group_title: value[0].group_title,
      group_time_key: key,
      players: value,
    });
  });

  return data;
}

export function getWClColor(rank: number) {
  if (rank < 25) return "#666666";
  if (rank < 50) return "#1eff00";
  if (rank < 75) return "#0070ff";
  if (rank < 95) return "#a335ee";
  if (rank < 99) return "#ff8000";
  if (rank < 100) return "#e268a8";
  if (rank === 100) return "#e5cc80";
}
