import { MessageOutlined } from '@ant-design/icons';
import { joinPresentation } from '@app/api/presentation.api';
import { Button } from '@app/components/common/buttons/Button/Button';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '@app/components/common/inputs/Input/Input';
import { ChatBox } from '@app/components/presentations/ChatBox/ChatBox';
import { PresSlide } from '@app/components/presentations/Slide/PresSlide';
import { notificationController } from '@app/controllers/notificationController';
import { MessageModel, SliceType, SlideModel } from '@app/domain/PresentationModel';
import { Card, Radio, Space } from 'antd';
import { useState } from 'react';
import { Socket } from 'socket.io-client';
import * as S from './Public.styles';

export const PublicPresentationPage = ({ socket }: { socket: Socket }) => {
  const [onPresentation, setOnPresentation] = useState(false);
  const [slide, setSlide] = useState<SlideModel | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * 1000000));
  const [chats, setChats] = useState<MessageModel[]>([] as MessageModel[]);
  const [chatVisible, setChatVisible] = useState(false);

  const listen = (code: string) => {
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
    socket.on(`presentation:${code}:chat`, (data) => {
      setChats((prev) => [data, ...prev]);
    });
    socket.on(`presentation:${randomNumber}:oldchat`, (data) => {
      setChats((prev) => {
        return [...prev, ...data];
      });
    });
    socket.on(`presentation:${code}:stop`, () => {
      setSlide({} as SlideModel);
      notificationController.info({ message: 'Presentation has been stopped' });
      socket.removeListener(`presentation:${code}:slide`);
      socket.removeListener(`presentation:${code}:chat`);
      socket.removeListener(`presentation:${code}:stop`);
    });
  };

  const handleOnFinish = (values: { code: string }) => {
    if (!values.code) return;
    joinPresentation(values.code.replace(/[ ]+/g, ''))
      .then((data) => {
        listen(values.code);
        socket.emit('presentation:join', { code: values.code, randomNumber: randomNumber });
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

  const handleSendMessage = (message: string) => {
    socket.emit('presentation:chat', { code: code, message: message });
  };

  const handleLoadMore = (page: number) => {
    socket.emit('presentation:oldchat', { code: code, page: page, randomNumber: randomNumber });
  };
  return (
    <S.BackgroundWrapper>
      {onPresentation ? (
        <>
          {slide !== null ? (
            <S.Container>
              <PresSlide slide={slide} />
              {slide.type === SliceType.MULTIPLE_CHOICE && slide.options && !isAnswered ? (
                <S.Options>
                  <Radio.Group onChange={handleOptionsChange}>
                    <Space direction="horizontal">
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
              <ChatBox
                visible={chatVisible}
                onSendMesage={handleSendMessage}
                onChatVisible={setChatVisible}
                onLoadMore={handleLoadMore}
                chats={chats}
              />
              <S.FloatButton>
                <div>
                  <MessageOutlined onClick={() => setChatVisible(!chatVisible)} />
                </div>
              </S.FloatButton>
            </S.Container>
          ) : (
            <div>Slide not found</div>
          )}
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
