import { toPng } from "html-to-image";
import { PlayersData } from "../types";
import { ACTOR_ORDER } from "../common";

async function htmlToPngDownload(el: HTMLElement, name: string) {
  const dataUrl = await toPng(el, { cacheBust: true });

  const link = document.createElement("a");
  link.download = `团本安排_${name}.png`;
  link.href = dataUrl;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function playersSort(players: PlayersData) {
  players.sort((a, b) => {
    const actorA = ACTOR_ORDER.indexOf(a.actor);
    const actorB = ACTOR_ORDER.indexOf(b.actor);
    return actorA - actorB;
  });
}

export { htmlToPngDownload, playersSort };
