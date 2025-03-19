import Image from "next/image";
import React from "react";

function AppTitle(props: { title: string; subTitle: string }) {
  return (
    <>
      <Image
        src="/images/logo.png"
        alt="logo"
        width={50}
        height={50}
        className="mr-2"
      />
      <h1 className="flex items-end flex-1 truncate min-w-0 space-x-2">
        <span className="text-base sm:text-lg md:text-xl lg:text-2xl text-amber-50">
          {props.title}
        </span>
        <span className="text-base text-[12px]"> {props.subTitle}</span>
      </h1>
    </>
  );
}

export default AppTitle;
