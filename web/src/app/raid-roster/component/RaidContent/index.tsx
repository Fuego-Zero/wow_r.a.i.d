import { Col, Row, Spin } from "antd";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Handler, RaidData } from "../../types";
import dynamic from "next/dynamic";
import RaidCard from "./components/RaidCard";
import { usePathname } from "next/navigation";
import { TalentType } from "@/app/constant";

import "./style.module.scss";
import classNames from "classnames";

const ScrollWrap = dynamic(() => import("@/app/components/common/ScrollWrap"), {
  ssr: false,
});

function RaidContent(
  props: {
    loading?: boolean;
    data: RaidData;
    displayMode?: boolean;
  } & Partial<Handler>
) {
  const { loading, data, ...rest } = props;
  const pathname = usePathname();

  const text = useMemo(
    () =>
      pathname === "/raid-roster"
        ? "当前 CD 还未排班，请尽快编排！"
        : "当前 CD 排班表还未发布，尽情期待！",
    [pathname]
  );

  const isAltDown = useRef(false);
  const [isShowHighlight, setIsShowHighlight] = useState(false);

  useEffect(() => {
    function onKeyup(e: KeyboardEvent) {
      if (e.key === "Alt" && isAltDown.current) {
        e.preventDefault();
        isAltDown.current = false;
        setIsShowHighlight(false);

        window.removeEventListener("keyup", onKeyup);
      }
    }

    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Alt" && !isAltDown.current) {
        e.preventDefault();
        isAltDown.current = true;
        setIsShowHighlight(true);

        window.addEventListener("keyup", onKeyup);
      }
    }

    window.addEventListener("keydown", onKeydown);

    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);

  const [highlightTalent, setHighlightTalent] = useState<TalentType[]>([]);

  const hoverTalent = useCallback(
    (talent: TalentType[]) => {
      setHighlightTalent(talent);
    },
    [setHighlightTalent]
  );

  if (loading) return <Spin size="large" fullscreen tip="数据加载中..."></Spin>;

  if (data.length === 0) {
    return (
      <div className="text-center text-amber-50 mt-[30vh] text-4xl p-x-5">
        {text}
      </div>
    );
  } else {
    return (
      <ScrollWrap
        className={classNames({
          [highlightTalent.map((item) => `highlight-${item}`).join(" ")]:
            isShowHighlight,
        })}
      >
        <Row gutter={[16, 8]} className="!mx-0 py-5">
          {data.map((item, index) => (
            <Col md={24} xxl={12} key={index}>
              <RaidCard data={item} hoverTalent={hoverTalent} {...rest} />
            </Col>
          ))}
        </Row>
      </ScrollWrap>
    );
  }
}

export default memo(RaidContent);
