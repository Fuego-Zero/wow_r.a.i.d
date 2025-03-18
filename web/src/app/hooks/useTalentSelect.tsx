import React, { useState } from "react";
import { TalentType } from "../constant";
import { Button, ButtonProps, Divider, Row } from "antd";
import Actor from "../components/Actor";

const isSelectProps: ButtonProps = {
  color: "primary",
  variant: "outlined",
};

const TANK: TalentType[] = ["FQ", "DKT"];
const HEALER: TalentType[] = ["NS", "NQ", "JLM", "ND"];
const DPS: TalentType[] = [
  "SCL",
  "ZDZ",
  "AC",
  "YD",
  "KBZ",
  "HF",
  "EMS",
  "TKS",
  "DS",
  "ZQS",
  "AM",
  "CJQ",
  "XDK",
  "BDK",
];

const OTHER: TalentType[] = [
  "FZ",
  "XT",
  "SJL",
  "SWL",
  "CSZ",
  "MRZ",
  "WQZ",
  "AF",
  "BF",
  "SM",
  "HMS",
];

function useTalentSelect(): [TalentType, React.ReactNode] {
  const [selectedActor, setSelectedActor] = useState<TalentType>("FQ");

  const [showAll, setShowAll] = useState(false);

  function onSelectActor(actor: TalentType) {
    setSelectedActor(actor);
  }

  const contextHolder = (
    <Row align="middle" className="space-x-2" gutter={[0, 8]}>
      <span>坦克</span>
      {TANK.map((item) => {
        return (
          <Button
            key={item}
            icon={<Actor actor={item} />}
            {...(selectedActor === item ? isSelectProps : {})}
            onClick={() => {
              onSelectActor(item);
            }}
          />
        );
      })}
      <span>治疗</span>
      {HEALER.map((item) => {
        return (
          <Button
            key={item}
            icon={<Actor actor={item} />}
            {...(selectedActor === item ? isSelectProps : {})}
            onClick={() => {
              onSelectActor(item);
            }}
          />
        );
      })}
      <span>输出</span>
      {DPS.map((item) => {
        return (
          <Button
            key={item}
            icon={<Actor actor={item} />}
            {...(selectedActor === item ? isSelectProps : {})}
            onClick={() => {
              onSelectActor(item);
            }}
          />
        );
      })}
      <Button onClick={() => setShowAll((prev) => !prev)}>
        {showAll ? "收起" : "展开"}
      </Button>
      {showAll && (
        <>
          <Divider type="horizontal" className="my-1" />
          <span>其他</span>
          {OTHER.map((item) => {
            return (
              <Button
                key={item}
                icon={<Actor actor={item} />}
                {...(selectedActor === item ? isSelectProps : {})}
                onClick={() => {
                  onSelectActor(item);
                }}
              />
            );
          })}
        </>
      )}
    </Row>
  );

  return [selectedActor, contextHolder];
}

export default useTalentSelect;
