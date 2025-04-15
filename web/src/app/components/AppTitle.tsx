import Image from "next/image";
import React, { useEffect, useMemo, useRef } from "react";

function AppTitle(props: { title: string; subTitle: string }) {
  const bgmEl = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!bgmEl.current) return;
    if (!bgmEl.current.muted) return;
    if (localStorage.getItem("BGM") === "0") return;

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

  function onToggleBGM() {
    if (!bgmEl.current) return;

    if (localStorage.getItem("BGM") === "0") {
      localStorage.setItem("BGM", "1");
      bgmEl.current.muted = false;
      bgmEl.current.play();
    } else {
      localStorage.setItem("BGM", "0");
      bgmEl.current.muted = true;
      bgmEl.current.pause();
    }
  }

  const bgmSrc = useMemo(() => {
    const num = Math.randomInt(1, 10);

    if (num === 1) return "/audio/四娘打呼.mp3";
    return "/audio/曹万江 - 你要结婚了.mp3";
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
        onClick={onToggleBGM}
      />
      <h1 className="flex items-end flex-1 truncate min-w-[160px] space-x-2">
        <span className="text-base sm:text-lg md:text-xl lg:text-2xl text-amber-50">
          {props.title}
        </span>
        <span className="text-base text-[12px]"> {props.subTitle}</span>
      </h1>
      <audio hidden ref={bgmEl} src={bgmSrc} autoPlay loop muted />
    </>
  );
}

export default AppTitle;
