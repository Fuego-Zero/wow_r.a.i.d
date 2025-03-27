import { TalentType } from "@/app/constant";
import { Handler, PlayersData, RaidData } from "@/app/raid-roster/types";
import { InferArrayItem } from "@yfsdk/web-basic-library";

export type Data = InferArrayItem<RaidData>;

export type RaidCardProps = {
  data: Data;
  displayMode?: boolean;
  hoverTalent: (talent: TalentType[]) => void;
} & Partial<Handler>;

export type RaidPlayerCardsProps = {
  players: PlayersData;
} & RaidCardProps;
