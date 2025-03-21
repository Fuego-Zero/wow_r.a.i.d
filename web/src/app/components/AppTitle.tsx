import Image from "next/image";
import React, { useEffect, useRef } from "react";

function AppTitle(props: { title: string; subTitle: string }) {
  const bgmEl = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!bgmEl.current) return;
    if (!bgmEl.current.muted) return;

    document.addEventListener(
      "click",
      () => {
        bgmEl.current!.muted = false;
        bgmEl.current!.play();
      },
      {
        once: true,
      }
    );
  }, []);

  return (
    <>
      <Image
        src="/images/logo.png"
        alt="logo"
        width={50}
        height={50}
        className="mr-2"
        priority
      />
      <h1 className="flex items-end flex-1 truncate min-w-[160px] space-x-2">
        <span className="text-base sm:text-lg md:text-xl lg:text-2xl text-amber-50">
          {props.title}
        </span>
        <span className="text-base text-[12px]"> {props.subTitle}</span>
      </h1>
      <audio
        hidden
        ref={bgmEl}
        src="/audio/曹万江 - 你要结婚了(正式版).mp3"
        autoPlay
        loop
        muted
      />
    </>
  );
}

export default AppTitle;
