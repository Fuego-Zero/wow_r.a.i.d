"use client";

import { Modal } from "antd";
import React, { useEffect, useState } from "react";

function useEasterEggVideo() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const num = Math.randomInt(1, 100);
    if (num !== 1) return;

    setTimeout(() => {
      setIsOpen(true);
    }, 500);
  }, []);

  const holder = (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={() => setIsOpen(false)}
      centered
      width={{
        xl: "50%",
      }}
      destroyOnClose
    >
      {isOpen && (
        <video width={700} height={700} controls src="/videos/welcome.mp4" />
      )}
    </Modal>
  );

  return [isOpen, holder];
}

export default useEasterEggVideo;
