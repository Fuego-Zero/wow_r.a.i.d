import { Handler, RaidData } from "@/app/raid-roster/types";
import { InferArrayItem } from "@yfsdk/web-basic-library";

export type Data = InferArrayItem<RaidData>;
export type Player = InferArrayItem<Data["players"]>;

export type RaidCardProps = {
  data: Data;
  displayMode?: boolean;
} & Partial<Handler>;

export type RaidPlayerCardsProps = { players: Player[] } & RaidCardProps;
