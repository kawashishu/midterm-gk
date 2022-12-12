import { joinPresentation } from '@app/api/presentation.api';
import { Button } from '@app/components/common/buttons/Button/Button';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '@app/components/common/inputs/Input/Input';
import { PresSlide } from '@app/components/presentations/Slide/PresSlide';
import { notificationController } from '@app/controllers/notificationController';
import { SliceType, SlideModel } from '@app/domain/PresentationModel';
import { Card, Radio, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import * as S from './Public.styles';

export const PublicPresentationPage = ({ socket }: { socket: Socket }) => {
  const [onPresentation, setOnPresentation] = useState(false);
  const [slide, setSlide] = useState<SlideModel | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const listenToUpdateSlide = (code: string) => {
    socket.on(`presentation:${code}:slide`, (data: SlideModel) => {
      setSlide((prev) => {
        if (prev) {
          if (prev.id !== data.id) {
            setIsAnswered(false);
          }
        }
        return data;
      });
    });
  };

  const handleOnFinish = (values: { code: string }) => {
    if (!values.code) return;
    joinPresentation(values.code.replace(/[ ]+/g, ''))
      .then((data) => {
        listenToUpdateSlide(values.code);
        socket.emit('presentation:join', values.code);
        setCode(values.code);
        setOnPresentation(true);
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
      });
  };

  const handleOptionsChange = (e: any) => {
    if (isAnswered) return;
    socket.emit('presentation:answer', { code: code, answer: e.target.value });
    setIsAnswered(true);
  };

  return onPresentation ? (
    <>
      {slide !== null ? (
        <S.Container>
          <PresSlide slide={slide} />
          {slide.type === SliceType.MULTIPLE_CHOICE && slide.options && !isAnswered ? (
            <S.Options>
              <Radio.Group onChange={handleOptionsChange}>
                <Space direction="vertical">
                  {slide.options.map((option) => (
                    <Radio value={option} key={option.name}>
                      {option.name}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </S.Options>
          ) : (
            isAnswered && (
              <S.Options>
                <div>Answered</div>
              </S.Options>
            )
          )}
        </S.Container>
      ) : (
        <div>Slide not found</div>
      )}
    </>
  ) : (
    <Card>
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
  );
};
