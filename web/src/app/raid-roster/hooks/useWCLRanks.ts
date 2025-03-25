import { TalentType } from "@/app/constant";
import { useAppConfig } from "@/app/player/context/appConfigContext";
import { PlayerData } from "../types";
import { WCLRank } from "@/app/player/types";

function useWCLRanks() {
  const { WCLRanksMap } = useAppConfig();

  function getWCLRank(
    role_name: PlayerData["role_name"],
    talent: TalentType
  ): WCLRank | null {
    const key = role_name + talent;
    const rank = WCLRanksMap.get(key) ?? null;
    return rank;
  }

  return { getWCLRank };
}

export default useWCLRanks;
