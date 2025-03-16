import React, { CSSProperties, useMemo } from "react";
import { RoleClasses, ROLE_CLASSES_COLOR_MAP } from "../constant";

function Players(props: React.PropsWithChildren<{ classes: RoleClasses }>) {
  const { classes, children } = props;

  const style = useMemo<CSSProperties>(() => {
    return {
      color: ROLE_CLASSES_COLOR_MAP[classes],
      flex: 1,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
    };
  }, [classes]);

  return <div style={style}>{children}</div>;
}

export default Players;
