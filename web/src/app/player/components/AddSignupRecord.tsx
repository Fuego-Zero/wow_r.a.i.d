import { App, Button, Checkbox, Divider, Empty, Form, Modal } from "antd";
import React, { useMemo, useState } from "react";
import { isBizException } from "@yfsdk/web-basic-library";
import { RoleInfo, SignupRecord } from "../types";
import Actor from "@/app/components/Actor";
import Players from "@/app/components/Players";
import { addRecord } from "../api";
import { useAuth } from "../context/authContext";
import { MenuOutlined } from "@ant-design/icons";

type Props = {
  roles: RoleInfo[];
  signupRecords: Set<SignupRecord["id"]>;
  onReload: () => Promise<void>;
};

function AddSignupRecord(props: Props) {
  const { userInfo } = useAuth();
  const { roles, signupRecords, onReload } = props;

  const { message, notification } = App.useApp();
  const [isOpen, setIsOpen] = useState(false);

  const [form] = Form.useForm<{
    ids: SignupRecord["id"][];
  }>();

  function openAddSignupRecord() {
    if (userInfo?.play_time.length === 0) {
      return notification.error({
        message: "报名失败，请先设置报名时间",
        description: (
          <span>
            报名时间在【个人中心】右上角
            <MenuOutlined className="mx-2" style={{ color: "red" }} />
            按钮展开的【编辑账号】内操作设置。
          </span>
        ),
      });
    }

    form.setFieldsValue({
      ids: [],
    });
    setCheckedListLength(0);
    setIsOpen(true);
  }

  function close() {
    form.resetFields();
    onReload();
    setIsOpen(false);
  }

  async function onFinish() {
    try {
      const value = await form.validateFields();

      if (value.ids.length > 0) {
        await addRecord(value);
        message.success("报名成功");
      }
      close();
    } catch (error) {
      if (isBizException(error)) return message.error(error.message);
      throw error;
    }
  }

  const options = useMemo(() => {
    return roles
      .filter((role) => !signupRecords.has(role.id))
      .map((role) => {
        return {
          label: (
            <div className="flex relative items-center justify-start w-full text-left">
              <Actor actor={role.talent} />
              <Players classes={role.classes}>{role.role_name}</Players>
            </div>
          ),
          value: role.id,
        };
      });
  }, [roles, signupRecords]);

  const [checkedListLength, setCheckedListLength] = useState(0);
  const checkAll = options.length === checkedListLength;
  const indeterminate =
    checkedListLength > 0 && checkedListLength < options.length;

  function onCheckAllChange() {
    let num;

    if (checkedListLength === options.length) {
      form.setFieldsValue({ ids: [] });
      num = 0;
    } else {
      const ids = roles
        .map((role) => role.id)
        .filter((id) => !signupRecords.has(id));

      form.setFieldsValue({ ids });
      num = options.length;
    }

    setCheckedListLength(num);
  }

  return (
    <>
      <Button block type="primary" onClick={openAddSignupRecord}>
        立即报名
      </Button>
      <Modal
        open={isOpen}
        title="报名活动"
        onOk={onFinish}
        onCancel={close}
        destroyOnClose
        forceRender
      >
        <Form form={form} initialValues={{ ids: [] }}>
          {options.length > 0 ? (
            <Form.Item
              label="角色列表"
              className="[&_.ant-checkbox-group-item]:items-center"
            >
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                全选
              </Checkbox>
              <Divider className="my-1" />
              <Form.Item name="ids" noStyle>
                <Checkbox.Group
                  options={options}
                  onChange={() => {
                    const ids = form.getFieldValue("ids");
                    setCheckedListLength(ids.length);
                  }}
                />
              </Form.Item>
            </Form.Item>
          ) : (
            <Empty />
          )}
        </Form>
      </Modal>
    </>
  );
}

export default AddSignupRecord;
