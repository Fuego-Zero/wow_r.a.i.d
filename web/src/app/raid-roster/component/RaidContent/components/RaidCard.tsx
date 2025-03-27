import { App, Button, Card } from "antd";
import React, { memo, useMemo, useRef, useState } from "react";

import { toPng } from "html-to-image";
import { getWClColor, htmlToPngDownload } from "@/app/utils";
import { RaidCardProps } from "./types";
import DesktopRaidCard from "./components/DesktopRaidCard";
import MobileRaidCard from "./components/MobileRaidCard";
import Role, { RoleType } from "@/app/components/Role";
import { PlayerData, PlayersData } from "@/app/raid-roster/types";
import useWCLRanks from "@/app/raid-roster/hooks/useWCLRanks";

function RaidCard(props: RaidCardProps) {
  const { data, displayMode, rosterPlayer } = props;
  const { notification } = App.useApp();
  const el = useRef(null);

  const [hideBtn, setHideBtn] = useState(false);

  async function onCopy() {
    if (!el.current) return;
    setHideBtn(true);

    const dataUrl = await toPng(el.current, { cacheBust: true });
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);

    notification.success({
      message: "复制成功",
      description: "已将图片复制到剪贴板",
      duration: 1,
    });

    setHideBtn(false);
  }

  async function onDownload() {
    if (!el.current) return;
    setHideBtn(true);

    await htmlToPngDownload(el.current, data.group_title);

    notification.success({
      message: "下载成功",
      description: "图片已成功下载",
      duration: 1,
    });

    setHideBtn(false);
  }

  const innerPlayers = useMemo<PlayersData>(() => {
    const empty = Array.from({
      length: 25,
    }).fill({
      talent: [],
    }) as PlayersData;

    return data.players.concat(empty).slice(0, 25);
  }, [data.players]);

  const { getWCLRank } = useWCLRanks();

  function calcAvg(players: PlayerData[]) {
    const total = players.reduce((acc, player) => {
      const rank = getWCLRank(player.role_name, player.talent[0]);
      if (!rank) return acc;

      return acc + rank.average_rank_percent;
    }, 0);
    return total / players.length;
  }

  function Title() {
    const roleMap = innerPlayers.reduce(
      (acc, player) => {
        acc.get(player.assignment)?.push(player);
        return acc;
      },
      new Map<RoleType, PlayersData>([
        ["TANK", []],
        ["DPS", []],
        ["HEALER", []],
      ])
    );

    const TANK_AVG = Number(calcAvg(roleMap.get("TANK")!).toFixed(2));
    const DPS_AVG = Number(calcAvg(roleMap.get("DPS")!).toFixed(2));
    const HEALER_AVG = Number(calcAvg(roleMap.get("HEALER")!).toFixed(2));

    return (
      <div className="flex items-center space-x-2">
        <span>{data.group_title}</span>
        <div className="flex items-center space-x-0.5 md:space-x-2 text-[12px] md:text-[14px]">
          <Role role="TANK" />
          <span>坦克</span>
          <span>{roleMap.get("TANK")?.length}</span>
          <span className="text-neutral-400">
            (<span style={{ color: getWClColor(TANK_AVG) }}>{TANK_AVG}</span>)
          </span>
          <Role role="DPS" />
          <span>输出</span>
          <span>{roleMap.get("DPS")?.length}</span>
          <span className="text-neutral-400">
            (<span style={{ color: getWClColor(DPS_AVG) }}>{DPS_AVG}</span>)
          </span>
          <Role role="HEALER" />
          <span>治疗</span>
          <span>{roleMap.get("HEALER")?.length}</span>
          <span className="text-neutral-400">
            (
            <span style={{ color: getWClColor(HEALER_AVG) }}>{HEALER_AVG}</span>
            )
          </span>
        </div>
      </div>
    );
  }

  return (
    <Card
      size="small"
      title={<Title />}
      className="group/RaidCard [&_.ant-card-body]:p-[6px] md:[&_.ant-card-body]:p-[12px]"
      extra={
        !hideBtn && (
          <div className="group-hover/RaidCard:block hidden">
            {!displayMode && (
              <Button
                type="link"
                onClick={() => {
                  rosterPlayer?.(data.group_time_key, data.group_title);
                }}
              >
                编辑
              </Button>
            )}
            <Button type="link" onClick={onDownload}>
              下载
            </Button>
            <Button type="link" onClick={onCopy}>
              复制
            </Button>
          </div>
        )
      }
      ref={el}
    >
      <DesktopRaidCard players={innerPlayers} {...props} />
      <MobileRaidCard players={innerPlayers} {...props} />
    </Card>
  );
}

export default memo(RaidCard);
