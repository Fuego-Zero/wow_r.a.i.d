"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";

import { RaidTime } from "../types";
import { BizException } from "@yfsdk/web-basic-library";
import { getRaidTime } from "../api";
import { useAuth } from "./authContext";

type AppConfigContextType = {
  raidTime: RaidTime[];
  raidTimeOrderMap: Map<RaidTime["time_key"], number>;
  raidTimeNameMap: Map<RaidTime["time_key"], RaidTime["time_name"]>;
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

    raidTime.forEach((value, index) => {
      setRaidTimeNameMap(
        (prev) => new Map(prev.set(value.time_key, value.time_name))
      );
      setRaidTimeOrderMap((prev) => new Map(prev.set(value.time_key, index)));
    });
  }

  useEffect(() => {
    if (isLogin) getData();
  }, [isLogin]);

  return (
    <AppConfigContext.Provider
      value={{ raidTime, raidTimeNameMap, raidTimeOrderMap }}
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
