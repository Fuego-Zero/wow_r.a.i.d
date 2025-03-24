import React, { CSSProperties, useMemo } from "react";
import { RoleClasses, ROLE_CLASSES_COLOR_MAP } from "../constant";

function Players(props: React.PropsWithChildren<{ classes: RoleClasses }>) {
  const { classes, children } = props;

  const style = useMemo<CSSProperties>(() => {
    return {
      color: ROLE_CLASSES_COLOR_MAP[classes],
    };
  }, [classes]);

  return (
    <div style={style} className="truncate min-w-0 flex-1">
      {children}
    </div>
  );
}

export default Players;
