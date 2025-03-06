import Actor from "./components/RaidContent/components/Actor";

export type InferArrayItem<T> = T extends Array<infer P> ? P : never;

type Actor = Parameters<typeof Actor>["0"]["actor"];

export type Data = {
  time: string;
  players: Array<{
    name: string;
    actor: Actor;
  }>;
}[];
