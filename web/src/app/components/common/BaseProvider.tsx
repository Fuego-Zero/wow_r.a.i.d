import { AppConfigProvider } from "@/app/player/context/appConfigContext";
import { AuthProvider } from "@/app/player/context/authContext";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, theme, App } from "antd";
import zhCN from "antd/locale/zh_CN";

export default function BaseProvider(props: React.PropsWithChildren) {
  return (
    <StyleProvider layer>
      <ConfigProvider locale={zhCN} theme={{ algorithm: theme.darkAlgorithm }}>
        <App>
          <AuthProvider>
            <AppConfigProvider>{props.children}</AppConfigProvider>
          </AuthProvider>
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
}
