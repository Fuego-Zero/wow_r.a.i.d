import { App, Button, Form, FormProps, Input, Row } from "antd";
import React from "react";
import { useAuth } from "../context/authContext";
import { isBizException } from "@yfsdk/web-basic-library";

type FieldType = {
  account: string;
  password: string;
};

function Login() {
  const { message } = App.useApp();
  const { login } = useAuth();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      await login(values);
    } catch (error) {
      if (isBizException(error)) {
        message.error(error.message);
      }
    }
  };

  return (
    <Row justify="center" className="mt-[20vh]">
      <Form
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="账号"
          name="account"
          rules={[{ required: true, message: "请输入账号!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );
}

export default Login;
