import { App, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { isBizException } from "@yfsdk/web-basic-library";
import { UserInfo } from "../types";
import { useAuth } from "../context";
import { changeUserinfo } from "../api";

function useChangeUserinfo(): [() => void, React.ReactNode] {
  const { message } = App.useApp();
  const { userInfo, reloadUserInfo } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const [form] = Form.useForm<{
    user_name: UserInfo["user_name"];
    wechat_name: UserInfo["wechat_name"];
    play_time: UserInfo["play_time"];
    account: UserInfo["account"];
  }>();

  function openChangeUserinfo() {
    setIsOpen(true);
  }

  function close() {
    form.resetFields();
    setIsOpen(false);
  }

  async function onFinish() {
    try {
      const value = await form.validateFields();
      await changeUserinfo(value);
      await reloadUserInfo();
      message.success("修改成功");
      close();
    } catch (error) {
      if (isBizException(error)) return message.error(error.message);
      throw error;
    }
  }

  const holder = (
    <Modal
      open={isOpen}
      title="修改信息"
      onOk={onFinish}
      onCancel={close}
      destroyOnClose
    >
      <Form
        form={form}
        initialValues={{
          user_name: userInfo?.user_name,
          wechat_name: userInfo?.wechat_name,
          play_time: userInfo?.play_time,
          account: userInfo?.account,
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
        <Form.Item
          name="wechat_name"
          label="微信名"
          rules={[
            {
              required: true,
              min: 2,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="play_time"
          label="报名时间"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );

  return [openChangeUserinfo, holder];
}

export default useChangeUserinfo;
