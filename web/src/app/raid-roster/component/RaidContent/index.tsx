import { Col, Row } from "antd";
import React, { memo } from "react";
import RaidCard from "./components/RaidCard";
import { Handler, RaidData } from "../../types";
import ScrollWrap from "@/app/components/common/ScrollWrap";

function RaidContent(
  props: {
    data: RaidData;
    displayMode?: boolean;
  } & Partial<Handler>
) {
  const { data, ...rest } = props;

  if (data.length === 0) {
    return (
      <div className="text-center text-amber-50 mt-[30vh] text-4xl">
        当前CD排班表还未发布，尽情期待！
      </div>
    );
  } else {
    return (
      <ScrollWrap>
        <Row gutter={[16, 8]} className="!mx-0 py-5">
          {data.map((item, index) => (
            <Col md={24} xxl={12} key={index}>
              <RaidCard data={item} {...rest} />
            </Col>
          ))}
        </Row>
      </ScrollWrap>
    );
  }
}

export default memo(RaidContent);
