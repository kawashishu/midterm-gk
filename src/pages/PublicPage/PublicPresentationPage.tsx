import { joinPresentation } from '@app/api/presentation.api';
import { Button } from '@app/components/common/buttons/Button/Button';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '@app/components/common/inputs/Input/Input';
import { GroupPresentation } from '@app/components/presentations/GroupPresentation/GroupPresentation';
import { notificationController } from '@app/controllers/notificationController';
import { Card } from 'antd';
import { useState } from 'react';
import { Socket } from 'socket.io-client';
import * as S from './Public.styles';

export const PublicPresentationPage = ({ socket }: { socket: Socket }) => {
  const [onPresentation, setOnPresentation] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  const handleOnFinish = (values: { code: string }) => {
    if (!values.code) return;
    joinPresentation(values.code.replace(/[ ]+/g, ''))
      .then((data) => {
        setCode(values.code);
        setOnPresentation(true);
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
      });
  };
  return (
    <S.BackgroundWrapper>
      {onPresentation && code ? (
        <>
          <S.Container>
            <GroupPresentation
              socket={socket}
              code={code}
              onStop={() => {
                setOnPresentation(false);
                setCode(null);
              }}
            />
          </S.Container>
        </>
      ) : (
        <S.Container>
          <Card size="small">
            <BaseForm onFinish={handleOnFinish}>
              <BaseForm.Item label="Presentation Code" name="code">
                <Input />
              </BaseForm.Item>
              <BaseForm.Item>
                <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                  Join
                </Button>
              </BaseForm.Item>
            </BaseForm>
          </Card>
        </S.Container>
      )}
    </S.BackgroundWrapper>
  );
};
