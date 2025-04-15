"use client";

import { Layout } from "antd";
import AppTitle from "../components/AppTitle";
import AppPublicMenu from "../components/AppPublicMenu";
import BaseProvider from "../components/common/BaseProvider";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const Masonry = dynamic(
  () => import("react-responsive-masonry").then((lib) => lib.default),
  {
    ssr: false,
  }
);

const ResponsiveMasonry = dynamic(
  () => import("react-responsive-masonry").then((lib) => lib.ResponsiveMasonry),
  {
    ssr: false,
  }
);

const ScrollWrap = dynamic(() => import("../components/common/ScrollWrap"), {
  ssr: false,
});

function PhotoContent() {
  const images = useMemo(() => {
    const images = Array.from({ length: 31 }).map((_, index) => {
      return `/images/${index}.jpg`;
    });

    for (let i = images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [images[i], images[j]] = [images[j], images[i]];
    }

    return images;
  }, []);

  return (
    <Layout className="h-[100vh] flex overflow-auto">
      <Layout.Header className="sticky top-0 z-10 w-full flex items-center mb-2">
        <AppTitle title="轻风之语" subTitle="欢乐时光" />
        <AppPublicMenu />
      </Layout.Header>
      <Layout.Content>
        <ScrollWrap defaultHideScrollbar>
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
          >
            <Masonry>
              {images.map((image, i) => (
                <Image
                  key={i}
                  src={image}
                  width={500}
                  height={500}
                  style={{ width: "100%", height: "auto", display: "block" }}
                  alt=""
                  priority
                />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </ScrollWrap>
      </Layout.Content>
    </Layout>
  );
}

export default function Photo() {
  return (
    <BaseProvider>
      <PhotoContent />
    </BaseProvider>
  );
}
