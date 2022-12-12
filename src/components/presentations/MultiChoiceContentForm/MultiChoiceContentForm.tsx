import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { OptionModel } from '@app/domain/PresentationModel';
import { Button, Input } from 'antd';
import { useState } from 'react';
import * as S from './MultiChoiceContentForm.styles';

export const MultiChoiceContentForm = ({ options }: { options?: OptionModel[] }) => {
  const [newOptions, setOptions] = useState(
    options
      ? options
      : ([
          {
            id: 1,
            name: 'Option 1',
            count: 0,
          },
          { id: 2, name: 'Option 2', count: 0 },
        ] as OptionModel[]),
  );
  return (
    <>
      <BaseForm.Item label={'Question'} name="heading" rules={[{ required: true }]}>
        <Input placeholder="Question" />
      </BaseForm.Item>
      <BaseForm.Item label="Description" name="content">
        <Input.TextArea placeholder="Description" />
      </BaseForm.Item>
      <BaseForm.Item label="Options">
        <BaseForm.List name="options" initialValue={options}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <S.OptionWrapper key={field.key}>
                  <BaseForm.Item
                    {...field}
                    name={[field.name, 'name']}
                    fieldKey={[field.key, 'name']}
                    rules={[{ required: true, message: 'Missing option name' }]}
                  >
                    <Input placeholder="Option name" />
                  </BaseForm.Item>
                  <Button type="text" icon={<CloseOutlined />} onClick={() => remove(field.name)} />
                </S.OptionWrapper>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined style={{ paddingBottom: '1rem' }} />}
              >
                Add option
              </Button>
            </>
          )}
        </BaseForm.List>
      </BaseForm.Item>
    </>
  );
};
