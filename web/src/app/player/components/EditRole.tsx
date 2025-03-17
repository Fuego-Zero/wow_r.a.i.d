import Actor from "@/app/components/Actor";
import { TalentType, RoleClasses } from "@/app/constant";
import {
  App,
  Button,
  ButtonProps,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Switch,
} from "antd";
import React, { useEffect, useState } from "react";
import { updateRole } from "../api";
import { isBizException } from "@yfsdk/web-basic-library";
import { RoleInfo } from "../types";
import { roleClassesOptions, roleClassesToTalentMap } from "./BindRole";
import Nameplate from "./Nameplate";

type Props = {
  roles: RoleInfo[];
  onReload: () => Promise<void>;
};

function EditRole(props: Props) {
  const { roles } = props;

  const { message } = App.useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm<RoleInfo>();
  const [isDualTalents, setIsDualTalents] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState<TalentType[]>([]);

  const isSelectProps: ButtonProps = {
    color: "primary",
    variant: "outlined",
  };

  function onClose() {
    setIsOpen(false);
    setIsDualTalents(false);
    setSelectedTalent([]);
    props.onReload();
  }

  async function onOk() {
    try {
      const values = await form.validateFields();
      await updateRole(values);
      message.success("更新成功");
      onClose();
    } catch (error) {
      if (isBizException(error)) return message.error(error.message);
      console.error(error);
    }
  }

  function onSelectActor(actor: TalentType) {
    //* 单天赋
    if (!isDualTalents) return setSelectedTalent([actor]);

    //* 双天赋, 限制选择两个
    if (selectedTalent.length === 2 && !selectedTalent.includes(actor)) {
      return message.warning("天赋超出，请取消后选择");
    } else if (selectedTalent.includes(actor)) {
      //* 取消选择
      return setSelectedTalent(selectedTalent.filter((item) => item !== actor));
    }

    setSelectedTalent([...selectedTalent, actor]);
  }

  useEffect(() => {
    form.setFieldsValue({ talent: selectedTalent });
  }, [form, selectedTalent]);

  useEffect(() => {
    if (!isOpen) form.resetFields();
  }, [form, isOpen]);

  const talents =
    roleClassesToTalentMap[form.getFieldValue("classes") as RoleClasses];

  const rolesOptions = roles.map((role) => {
    return {
      value: role.id,
      label: (
        <Nameplate
          classes={role.classes}
          role_name={role.role_name}
          talent={role.talent}
        />
      ),
    };
  });

  function selectRole(role: RoleInfo) {
    setIsDualTalents(role.talent.length === 2);
    setSelectedTalent([role.talent[0]]);

    form.setFieldsValue({
      id: role.id,
      role_name: role.role_name,
      talent: role.talent,
      classes: role.classes,
      auto_signup: role.auto_signup,
    });
  }

  function onChangeRoles(value: string) {
    const role = roles.find((role) => role.id === value);
    if (!role) return;
    selectRole(role);
  }

  function onOpenHandler() {
    if (roles[0]) selectRole(roles[0]);
    setIsOpen(true);
  }

  return (
    <>
      <Button block type="dashed" onClick={onOpenHandler}>
        修改角色
      </Button>
      <Modal
        forceRender
        open={isOpen}
        title="修改角色"
        onCancel={onClose}
        onOk={onOk}
        destroyOnClose
      >
        <Form form={form} initialValues={{ classes: "QS", auto_signup: true }}>
          <Form.Item name="id" label="角色" rules={[{ required: true }]}>
            <Select options={rolesOptions} onChange={onChangeRoles} />
          </Form.Item>
          <Form.Item name="role_name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="auto_signup" label="自动报名">
            <Switch />
          </Form.Item>
          <Form.Item label="职业" name="classes">
            <Radio.Group
              options={roleClassesOptions}
              onChange={() => {
                setSelectedTalent([]);
              }}
            />
          </Form.Item>

          {talents && (
            <Form.Item
              label="天赋"
              name="talent"
              rules={[{ required: true, message: "请选择天赋" }]}
              extra={
                <div className="flex items-center space-x-2">
                  <span>双修</span>
                  <Switch
                    value={isDualTalents}
                    onChange={() => {
                      setIsDualTalents((value) => !value);
                      if (selectedTalent.length === 2) {
                        setSelectedTalent([selectedTalent[0]]);
                      }
                    }}
                  />
                </div>
              }
            >
              <div className="space-x-2">
                {talents.map((talent) => {
                  const props = selectedTalent.includes(talent)
                    ? isSelectProps
                    : {};

                  return (
                    <Button
                      key={talent}
                      {...props}
                      onClick={() => {
                        onSelectActor(talent);
                      }}
                    >
                      <Actor actor={talent} />
                    </Button>
                  );
                })}
              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
}

export default EditRole;
