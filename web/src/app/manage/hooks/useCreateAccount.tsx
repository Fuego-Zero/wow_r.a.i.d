import { App, Form, Input, Modal } from "antd";
import React, { useRef, useState } from "react";
import { isBizException } from "@yfsdk/web-basic-library";
import { UserInfo } from "../types";
import { createAccount } from "../api";

function useCreateAccount(): [() => Promise<void>, React.ReactNode] {
  const { message } = App.useApp();
  const [isOpen, setIsOpen] = useState(false);

  const [form] = Form.useForm<{
    user_name: UserInfo["user_name"];
    account: UserInfo["account"];
  }>();

  const prs = useRef<(value?: any) => void>(() => {});

  function open() {
    return new Promise((resolve) => {
      setIsOpen(true);
      prs.current = resolve;
    });
  }

  function close() {
    form.resetFields();
    setIsOpen(false);
  }

  async function onFinish() {
    try {
      const value = await form.validateFields();
      await createAccount(value.account, value.user_name);
      message.success("创建成功");
      close();
      prs.current();
    } catch (error) {
      if (isBizException(error)) return message.error(error.message);
      throw error;
    }
  }

  const holder = (
    <Modal
      open={isOpen}
      title="创建账号"
      onOk={onFinish}
      onCancel={close}
      destroyOnClose
    >
      <Form
        form={form}
        initialValues={{
          user_name: "",
          account: "",
        }}
      >
        <Form.Item
          name="account"
          label="账号"
          rules={[
            {
              required: true,
              min: 4,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="user_name"
          label="用户名"
          rules={[
            {
              required: true,
              min: 2,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );

  return [open, holder];
}

export default useCreateAccount;
