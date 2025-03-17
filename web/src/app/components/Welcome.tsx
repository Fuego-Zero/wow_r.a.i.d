import { Modal } from "antd";
import React, { memo, useEffect, useState } from "react";

import { extend } from "@yfsdk/web-basic-library";
import Image from "next/image";

extend();

function Welcome() {
  const [isOpen, setIsOpen] = useState(false);

  const showIndex = Math.randomInt(1, 2);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={() => setIsOpen(false)}
      closeIcon={null}
      centered
    >
      {showIndex === 1 ? (
        <div className="video-container">
          <video width="100%" height="auto" controls autoPlay muted>
            <source src="/videos/welcome.mp4" type="video/mp4" />
          </video>
        </div>
      ) : (
        <Image width={1072} height={1158} src="/images/1.jpg" alt="welcome" />
      )}
    </Modal>
  );
}

export default memo(Welcome);
