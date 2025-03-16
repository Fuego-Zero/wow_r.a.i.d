import { toPng } from "html-to-image";
import { ACTOR_ORDER } from "../common";
import { PlayerData, PlayersData } from "../raid-roster/types";

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

export function playersSortByTalent(players: PlayersData) {
  players.sort((a, b) => {
    const actorA = ACTOR_ORDER.indexOf(a.talent[0]);
    const actorB = ACTOR_ORDER.indexOf(b.talent[0]);
    return actorA - actorB;
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
