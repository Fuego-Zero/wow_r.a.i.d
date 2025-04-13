import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { ECBasicOption } from "echarts/types/dist/shared";

function BaseCharts(props: { options?: ECBasicOption }) {
  const { options = {} } = props;

  const el = useRef(null);
  const chart = useRef<echarts.ECharts>(null);

  useEffect(() => {
    if (!el.current) return;
    if (!chart.current) {
      chart.current = echarts.init(el.current, "dark");
    }

    chart.current.setOption({ ...options, backgroundColor: "translate" });
  }, [options]);

  useEffect(() => {
    function resize() {
      if (!chart.current) return;
      chart.current.resize();
    }

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <div ref={el} className="w-full h-full" />;
}

export default BaseCharts;
