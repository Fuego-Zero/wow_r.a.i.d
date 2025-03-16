import Actor from "@/app/components/Actor";
import {
  TalentType,
  ROLE_CLASSES_COLOR_MAP,
  RoleClasses,
} from "@/app/constant";
import {
  App,
  Button,
  ButtonProps,
  Form,
  Input,
  Modal,
  Radio,
  Switch,
} from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import React, { useEffect, useState } from "react";
import { bindRole } from "../api";
import { isBizException } from "@yfsdk/web-basic-library";

const RolesClasses: RoleClasses[] = [
  "QS",
  "DK",
  "XD",
  "LR",
  "FS",
  "MS",
  "DZ",
  "SM",
  "SS",
  "ZS",
];

const roleClassesNameMap: Record<RoleClasses, string> = {
  QS: "骑士",
  DK: "死骑",
  XD: "小德",
  LR: "猎人",
  FS: "法师",
  MS: "牧师",
  DZ: "盗贼",
  SM: "萨满",
  SS: "术士",
  ZS: "战士",
};

const roleClassesToTalentMap: Record<RoleClasses, TalentType[]> = {
  DK: ["BDK", "DKT", "XDK"],
  XD: ["AC", "ND", "XT", "YD"],
  LR: ["SWL", "SCL", "SJL"],
  FS: ["AF", "BF", "HF"],
  QS: ["CJQ", "FQ", "NQ"],
  MS: ["AM", "JLM", "SM"],
  DZ: ["CSZ", "ZDZ", "MRZ"],
  SM: ["DS", "NS", "ZQS"],
  SS: ["EMS", "TKS", "HMS"],
  ZS: ["FZ", "KBZ", "WQZ"],
};

const roleClassesOptions: CheckboxGroupProps<string>["options"] =
  RolesClasses.map((role) => {
    return {
      label: (
        <span style={{ color: ROLE_CLASSES_COLOR_MAP[role] }}>
          {roleClassesNameMap[role]}
        </span>
      ),
      value: role,
    };
  });

function BindRole(props: { onReload: () => Promise<void> }) {
  const { message } = App.useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm<{
    name: string;
    talent: TalentType[];
    classes: RoleClasses;
  }>();
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
      await bindRole(values);
      message.success("绑定成功");
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

  return (
    <>
      <Button block type="dashed" onClick={() => setIsOpen(true)}>
        绑定角色
      </Button>
      <Modal
        forceRender
        open={isOpen}
        title="绑定角色"
        onCancel={onClose}
        onOk={onOk}
        destroyOnClose
      >
        <Form form={form} initialValues={{ classes: "QS" }}>
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
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

export default BindRole;
