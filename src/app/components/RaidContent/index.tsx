import { Col, Row } from "antd";
import React from "react";
import RaidCard from "./components/RaidCard";

function RaidContent() {
  return (
    <Row gutter={[16, 8]} className="!mx-0 mt-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Col xs={24} lg={12} key={index}>
          <RaidCard />
        </Col>
      ))}
    </Row>
  );
}

export default RaidContent;
