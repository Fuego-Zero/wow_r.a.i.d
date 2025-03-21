"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
  useMemo,
} from "react";

import userStorage from "@/app/classes/UserStorage";
import { UserInfo } from "../types";
import { BizException, isBizException } from "@yfsdk/web-basic-library";

import * as api from "../api";
import { App } from "antd";
import { hashPassword } from "../utils";

type AuthContextType = {
  isLoading: boolean;
  isLogin: boolean;
  isAdmin: boolean;
  userInfo: UserInfo | null;
  login: (value: { account: string; password: string }) => Promise<void>;
  logout: () => void;
  reloadUserInfo: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { message } = App.useApp();

  async function reloadUserInfo() {
    const user = await api.getUserInfo();
    setUserInfo(user);
  }

  useEffect(() => {
    (async () => {
      try {
        const storedUser = userStorage.getUser();
        if (!storedUser) return setIsLoading(false);

        await reloadUserInfo();
        setIsLogin(true);
        setIsLoading(false);
      } catch (error) {
        if (isBizException(error)) return message.error("获取用户信息失败");
        console.error(error);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login: AuthContextType["login"] = async (value) => {
    value.password = await hashPassword(value.password);
    const user = await api.login(value);

    userStorage.setUser(user);
    setUserInfo(user);
    setIsLogin(true);
  };

  const logout = () => {
    userStorage.clear();
    setUserInfo(null);
    setIsLogin(false);
  };

  const isAdmin = useMemo<boolean>(() => {
    return Boolean(userInfo?.is_admin);
  }, [userInfo?.is_admin]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLogin,
        isAdmin,
        userInfo,
        login,
        logout,
        reloadUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new BizException("useAuth必须在AuthProvider内部使用");
  }

  return context;
}
