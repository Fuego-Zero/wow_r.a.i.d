"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";

import { RaidTime, WCLRank } from "../types";
import { BizException } from "@yfsdk/web-basic-library";
import { getRaidTime, getWCLRanks } from "../api";
import { useAuth } from "./authContext";

type AppConfigContextType = {
  raidTime: RaidTime[];
  raidTimeOrderMap: Map<RaidTime["time_key"], number>;
  raidTimeNameMap: Map<RaidTime["time_key"], RaidTime["time_name"]>;
  WCLRanksMap: Map<string, WCLRank>;
  reloadWCLRanks: () => void;
};

const AppConfigContext = createContext<AppConfigContextType | undefined>(
  undefined
);

export function AppConfigProvider({ children }: PropsWithChildren) {
  const { isLogin } = useAuth();
  const [raidTime, setRaidTime] = useState<AppConfigContextType["raidTime"]>(
    []
  );
  const [raidTimeOrderMap, setRaidTimeOrderMap] = useState<
    AppConfigContextType["raidTimeOrderMap"]
  >(new Map());
  const [raidTimeNameMap, setRaidTimeNameMap] = useState<
    AppConfigContextType["raidTimeNameMap"]
  >(new Map());

  async function getData() {
    const raidTime = await getRaidTime();
    setRaidTime(raidTime);

    raidTime.forEach((value) => {
      setRaidTimeNameMap(
        (prev) => new Map(prev.set(value.time_key, value.time_name))
      );
      setRaidTimeOrderMap(
        (prev) => new Map(prev.set(value.time_key, value.order))
      );
    });
  }

  useEffect(() => {
    if (isLogin) getData();
  }, [isLogin]);

  const [WCLRanksMap, setWCLRanksMap] = useState(new Map());

  async function getWCLData() {
    const data = await getWCLRanks();
    const map = data.reduce((acc, item) => {
      acc.set(item.role_name + item.talent, item);
      return acc;
    }, new Map());

    setWCLRanksMap(map);
  }

  useEffect(() => {
    getWCLData();
  }, []);

  return (
    <AppConfigContext.Provider
      value={{
        raidTime,
        raidTimeNameMap,
        raidTimeOrderMap,
        WCLRanksMap,
        reloadWCLRanks: getWCLData,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfig() {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new BizException("useAppConfig必须在AppConfigProvider内部使用");
  }

  return context;
}
