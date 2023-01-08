import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from 'antd';

export const HeadingContentForm = () => {
  return (
    <>
      <BaseForm.Item label={'Heading'} name="heading" rules={[{ required: true }]}>
        <Input placeholder="Heading" />
      </BaseForm.Item>
      <BaseForm.Item label="SubHeading" name="subHeading">
        <Input placeholder="SubHeading" />
      </BaseForm.Item>
    </>
  );
};
