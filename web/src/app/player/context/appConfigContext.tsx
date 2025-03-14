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
};

const AppConfigContext = createContext<AppConfigContextType | undefined>(
  undefined
);

export function AppConfigProvider({ children }: PropsWithChildren) {
  const [raidTime, setRaidTime] = useState<AppConfigContextType["raidTime"]>(
    []
  );
  const { isLogin } = useAuth();

  async function getData() {
    const res = await getRaidTime();
    setRaidTime(res);
  }

  useEffect(() => {
    if (isLogin) getData();
  }, [isLogin]);

  return (
    <AppConfigContext.Provider value={{ raidTime }}>
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
