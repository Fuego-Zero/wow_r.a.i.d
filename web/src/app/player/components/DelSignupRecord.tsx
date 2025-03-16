import { App, Button, Checkbox, Divider, Empty, Form, Modal } from "antd";
import React, { useMemo, useState } from "react";
import { isBizException } from "@yfsdk/web-basic-library";
import { RoleInfo, SignupRecord } from "../types";
import Actor from "@/app/components/Actor";
import Players from "@/app/components/Players";
import { delRecord } from "../api";

type Props = {
  roles: RoleInfo[];
  signupRecords: SignupRecord[];
  onReload: () => Promise<void>;
};

function DelSignupRecord(props: Props) {
  const { roles, signupRecords, onReload } = props;

  const { message } = App.useApp();
  const [isOpen, setIsOpen] = useState(false);

  const [form] = Form.useForm<{
    ids: SignupRecord["id"][];
  }>();

  function openAddSignupRecord() {
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
        await delRecord(value);
        message.success("取消成功");
      }
      close();
    } catch (error) {
      if (isBizException(error)) return message.error(error.message);
      throw error;
    }
  }

  const options = useMemo(() => {
    return roles
      .filter((role) =>
        signupRecords.some((record) => record.role_id === role.id)
      )
      .map((role) => {
        const find = signupRecords.find((record) => record.role_id === role.id);

        return {
          label: (
            <div className="flex relative items-center justify-start w-full text-left">
              <Actor actor={role.talent} />
              <Players classes={role.classes}>{role.role_name}</Players>
            </div>
          ),
          value: find?.id,
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
      const ids = signupRecords.map((record) => record.id);
      form.setFieldsValue({ ids });
      num = options.length;
    }

    setCheckedListLength(num);
  }

  return (
    <>
      <Button block type="dashed" danger onClick={openAddSignupRecord}>
        取消报名
      </Button>
      <Modal
        open={isOpen}
        title="取消报名"
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

export default DelSignupRecord;
