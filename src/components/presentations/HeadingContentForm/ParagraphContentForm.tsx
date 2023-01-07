import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from 'antd';

export const ParagraphContentForm = () => {
  return (
    <>
      <BaseForm.Item label={'Heading'} name="heading" rules={[{ required: true }]}>
        <Input placeholder="Heading" />
      </BaseForm.Item>
      <BaseForm.Item label="Paragraph" name="content">
        <Input.TextArea placeholder="Paragraph" />
      </BaseForm.Item>

    </>
  );
};
