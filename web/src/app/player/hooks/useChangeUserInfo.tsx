import { App, Checkbox, Divider, Form, Input, Modal } from "antd";
import React, { useMemo, useState } from "react";
import { isBizException } from "@yfsdk/web-basic-library";
import { UserInfo } from "../types";
import { useAuth } from "../context/authContext";
import { changeUserinfo } from "../api";
import { useAppConfig } from "../context/appConfigContext";

function useChangeUserinfo(): [() => void, React.ReactNode] {
  const { message } = App.useApp();
  const { userInfo, reloadUserInfo } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { raidTime } = useAppConfig();

  const [form] = Form.useForm<{
    user_name: UserInfo["user_name"];
    wechat_name: UserInfo["wechat_name"];
    play_time: UserInfo["play_time"];
    account: UserInfo["account"];
  }>();

  function openChangeUserinfo() {
    form.setFieldsValue({
      user_name: userInfo?.user_name,
      wechat_name: userInfo?.wechat_name,
      play_time: userInfo?.play_time,
      account: userInfo?.account,
    });
    setCheckedListLength(userInfo?.play_time.length || 0);
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

  const raidTimeOptions = useMemo(() => {
    return raidTime.map((item) => {
      return {
        label: item.time_name,
        value: item.time_key,
      };
    });
  }, [raidTime]);

  const [checkedListLength, setCheckedListLength] = useState(0);
  const checkAll = raidTimeOptions.length === checkedListLength;
  const indeterminate =
    checkedListLength > 0 && checkedListLength < raidTimeOptions.length;

  function onCheckAllChange() {
    let num;

    if (checkedListLength === raidTimeOptions.length) {
      form.setFieldsValue({ play_time: [] });
      num = 0;
    } else {
      form.setFieldsValue({
        play_time: raidTimeOptions.map((item) => item.value),
      });
      num = raidTimeOptions.length;
    }

    setCheckedListLength(num);
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
          user_name: "",
          wechat_name: "",
          play_time: [],
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
        <Form.Item
          name="wechat_name"
          label="微信名"
          rules={[
            {
              required: true,
              min: 1,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="报名时间">
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            全选
          </Checkbox>
          <Divider className="my-1" />
          <Form.Item name="play_time" noStyle>
            <Checkbox.Group options={raidTimeOptions} />
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );

  return [openChangeUserinfo, holder];
}

export default useChangeUserinfo;
