"use client";

import { Layout } from "antd";
import AppTitle from "../components/AppTitle";
import AppPublicMenu from "../components/AppPublicMenu";
import BaseProvider from "../components/common/BaseProvider";

import Image from "next/image";
import dynamic from "next/dynamic";

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
  const images = [
    "/images/0.jpg",
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg",
    "/images/6.jpg",
    "/images/7.jpg",
    "/images/8.jpg",
    "/images/9.jpg",
    "/images/10.jpg",
    "/images/11.jpg",
  ];

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

export default function Game() {
  return (
    <BaseProvider>
      <PhotoContent />
    </BaseProvider>
  );
}
