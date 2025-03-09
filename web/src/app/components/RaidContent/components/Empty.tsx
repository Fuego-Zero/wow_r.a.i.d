import React from "react";

function Empty(props: { onClick: () => void }) {
  return (
    <div
      className="flex items-center justify-center w-full h-full cursor-pointer"
      {...props}
    >
      空
    </div>
  );
}

export default Empty;
