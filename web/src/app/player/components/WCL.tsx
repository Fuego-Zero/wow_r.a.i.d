import React, { memo, useMemo } from "react";

function WCL(props: { rank?: number }) {
  const { rank } = props;

  const color = useMemo(() => {
    if (rank === undefined) return "";
    if (rank < 25) return "#666666";
    if (rank < 50) return "#1eff00";
    if (rank < 75) return "#0070ff";
    if (rank < 95) return "#a335ee";
    if (rank < 99) return "#ff8000";
    if (rank < 100) return "#e268a8";
    if (rank === 100) return "#e5cc80";
  }, [rank]);

  return (
    rank && (
      <span className="wcl" style={{ color }}>
        {rank}
      </span>
    )
  );
}

export default memo(WCL) as typeof WCL;
