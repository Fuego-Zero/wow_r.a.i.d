"use client";

import { Layout } from "antd";
import AppTitle from "../components/AppTitle";
import AppPublicMenu from "../components/AppPublicMenu";
import BaseProvider from "../components/common/BaseProvider";
import { useEffect, useRef, useState } from "react";

function GameContent() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const el = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!el.current) return;

    const ob = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setWidth(width);
      setHeight(height);
    });

    ob.observe(el.current);

    return () => {
      ob.disconnect();
    };
  }, []);

  return (
    <Layout className="h-[100vh] flex overflow-auto">
      <Layout.Header className="sticky top-0 z-10 w-full flex items-center">
        <AppTitle title="轻风之语" subTitle="休闲小游戏" />
        <AppPublicMenu />
      </Layout.Header>
      <Layout.Content ref={el}>
        <iframe
          frameBorder={0}
          width={width}
          height={height}
          src="https://game.fuego.site/"
        />
      </Layout.Content>
    </Layout>
  );
}

export default function Game() {
  return (
    <BaseProvider>
      <GameContent />
    </BaseProvider>
  );
}
