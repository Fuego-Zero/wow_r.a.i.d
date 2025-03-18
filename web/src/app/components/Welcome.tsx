import { Modal } from "antd";
import React, { memo, useEffect, useState } from "react";

import { extend } from "@yfsdk/web-basic-library";
import Image from "next/image";

extend();

function Welcome() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const [imgIndex, setImgIndex] = useState(Math.randomInt(0, 9));

  useEffect(() => {
    const timer = setInterval(() => {
      setImgIndex((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={() => setIsOpen(false)}
      closeIcon={null}
      centered
      width={{
        xl: "50%",
      }}
    >
      <Image
        width={700}
        height={700}
        src={`/images/${imgIndex % 10}.jpg`}
        alt="welcome"
      />
    </Modal>
  );
}

export default memo(Welcome);
