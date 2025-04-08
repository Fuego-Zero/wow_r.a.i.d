"use client";

import { App, Col, Divider, Form, Modal, Row, Switch } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { GroupInfo } from "../types";
import { getGroupInfo, saveGroupInfo } from "../api";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { isBizException } from "@yfsdk/web-basic-library";

function useGroupManage(
  onLoad: () => Promise<void>
): [() => void, React.ReactNode, GroupInfo[]] {
  const { message } = App.useApp();
  const [groupInfo, setGroupInfo] = useState<GroupInfo[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  const [form] = Form.useForm<{
    groupInfo: GroupInfo[];
  }>();

  const getData = useCallback(async () => {
    try {
      const res = await getGroupInfo();
      setGroupInfo(res);
    } catch (error) {
      if (isBizException(error)) return message.error(error.message);
      console.error(error);
    }
  }, [message]);

  const open = useCallback(async (): Promise<void> => {
    await getData();
    setIsOpen(true);
  }, [getData]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onClose() {
    form.resetFields();
    setIsOpen(false);
  }

  async function onSave() {
    try {
      const values = form.getFieldValue("groupInfo");
      await saveGroupInfo(values);

      setGroupInfo(values);
      message.success("保存成功");
      setIsOpen(false);

      setTimeout(() => {
        onLoad();
      }, 750);
    } catch (error) {
      if (isBizException(error)) return message.error(error.message);
      console.error(error);
    }
  }

  const Holder = (
    <Modal
      title="团队活动档期管理"
      maskClosable
      open={isOpen}
      width={700}
      onCancel={onClose}
      centered
      onOk={onSave}
      destroyOnClose
    >
      <Row>
        <Col span={24} className="text-red-400 space-x-2">
          <ExclamationCircleOutlined />
          <span>
            关闭档期的时候，如果该档期已有排班的玩家，则会直接清空该档期的排班信息！
          </span>
        </Col>
      </Row>
      <Divider className="my-2" />
      <Form form={form} initialValues={{ groupInfo }}>
        <Row align="middle" gutter={[8, 8]}>
          <Form.List name="groupInfo">
            {(fields) =>
              fields.map((field) => (
                <Col span={8} key={field.key}>
                  <Row align="middle">
                    <Col span={10}>
                      {form.getFieldValue(["groupInfo", field.name, "title"])}
                    </Col>
                    <Col span={7}>
                      <Form.Item name={[field.name, "enable"]} noStyle>
                        <Switch
                          checkedChildren="启用"
                          unCheckedChildren="停用"
                          onChange={(checked) => {
                            const groupInfo = form.getFieldValue("groupInfo");
                            groupInfo[field.name].auto = checked;
                            form.setFieldsValue({ groupInfo });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item name={[field.name, "auto"]} noStyle>
                        <Switch
                          checkedChildren="自动"
                          unCheckedChildren="手动"
                          disabled={
                            !form.getFieldValue([
                              "groupInfo",
                              field.name,
                              "enable",
                            ])
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              ))
            }
          </Form.List>
        </Row>
      </Form>
    </Modal>
  );

  return [open, Holder, groupInfo];
}

export default useGroupManage;
