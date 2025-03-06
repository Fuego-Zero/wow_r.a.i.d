import { Col, Row } from "antd";
import React from "react";
import RaidCard from "./components/RaidCard";
import { Data } from "@/app/types";

function RaidContent(props: {
  data: Data;
  delPlayer: (time: string, index: number) => void;
}) {
  const { data, ...rest } = props;

  return (
    <Row gutter={[16, 8]} className="!mx-0 py-5">
      {data.map((item, index) => (
        <Col xs={24} lg={12} key={index}>
          <RaidCard data={item} {...rest} />
        </Col>
      ))}
    </Row>
  );
}

export default RaidContent;
