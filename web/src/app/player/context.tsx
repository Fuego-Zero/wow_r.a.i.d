"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";

import userStorage from "@/app/classes/UserStorage";
import { UserInfo } from "./types";
import { BizException, isBizException } from "@yfsdk/web-basic-library";

import * as api from "./api";
import { App } from "antd";

type AuthContextType = {
  isLogin: boolean;
  userInfo: UserInfo | null;
  login: (value: { account: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { message } = App.useApp();

  useEffect(() => {
    (async () => {
      try {
        const storedUser = userStorage.getUser();
        if (!storedUser) return;

        const user = await api.getUserInfo();
        setIsLogin(true);
        setUserInfo(user);
      } catch (error) {
        if (isBizException(error)) return message.error("获取用户信息失败");
        console.error(error);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login: AuthContextType["login"] = async (value) => {
    const user = await api.login(value);

    userStorage.setUser(user);
    setUserInfo(user);
    setIsLogin(true);
  };

  const logout = () => {
    setUserInfo(null);
    setIsLogin(false);
  };

  return (
    <AuthContext.Provider value={{ isLogin, userInfo, login, logout }}>
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
