import { App, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { changePassword } from "../api";
import { hashPassword } from "../utils";
import { isBizException } from "@yfsdk/web-basic-library";

function useChangePassword(): [() => void, React.ReactNode] {
  const { message } = App.useApp();
  const [isOpen, setIsOpen] = useState(false);

  const [form] = Form.useForm<{
    password: string;
    confirm: string;
  }>();

  function openChangePassword() {
    setIsOpen(true);
  }

  function close() {
    form.resetFields();
    setIsOpen(false);
  }

  async function onFinish() {
    try {
      const value = await form.validateFields();
      const password = hashPassword(value.password);
      await changePassword(password);
      close();
      message.success("修改成功");
    } catch (error) {
      if (isBizException(error)) return message.error(error.message);
      throw error;
    }
  }

  const holder = (
    <Modal
      open={isOpen}
      title="修改密码"
      onOk={onFinish}
      onCancel={close}
      destroyOnClose
    >
      <Form form={form}>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              min: 8,
              max: 16,
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="确认密码"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              min: 8,
              max: 16,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("两次输入的密码不一致"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );

  return [openChangePassword, holder];
}

export default useChangePassword;
