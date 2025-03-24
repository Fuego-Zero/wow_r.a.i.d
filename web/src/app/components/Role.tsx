import Image from "next/image";
import React, { memo, useMemo } from "react";

enum RoleMap {
  TANK = "TANK",
  DPS = "DPS",
  HEAL = "HEAL",
}

export type RoleType = keyof typeof RoleMap;

type Props = {
  role: RoleType;
  className?: string;
  width?: number;
  height?: number;
};

const IMAGES = {
  TANK: "/images/roles/TANK.png",
  DPS: "/images/roles/DPS.png",
  HEAL: "/images/roles/HEAL.png",
};

function Role(props: Props) {
  const { role, className, height = 24, width = 24 } = props;
  const src = useMemo(() => IMAGES[role], [role]);

  return (
    <Image
      className={className}
      src={src}
      width={width}
      height={height}
      alt="role"
    />
  );
}

export default memo(Role) as typeof Role;
