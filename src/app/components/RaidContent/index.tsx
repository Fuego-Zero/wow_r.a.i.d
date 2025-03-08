import { Col, Row } from "antd";
import React from "react";
import RaidCard from "./components/RaidCard";
import { Handler, RaidData } from "@/app/types";

function RaidContent(
  props: {
    data: RaidData;
  } & Handler
) {
  const { data, ...rest } = props;

  return (
    <Row gutter={[16, 8]} className="!mx-0 py-5">
      {data.map((item, index) => (
        <Col md={24} xxl={12} key={index}>
          <RaidCard data={item} {...rest} />
        </Col>
      ))}
    </Row>
  );
}

export default RaidContent;
