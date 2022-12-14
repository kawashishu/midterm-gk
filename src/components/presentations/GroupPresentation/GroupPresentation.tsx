import { ExpandOutlined, FullscreenExitOutlined, MessageOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { notificationController } from '@app/controllers/notificationController';
import { MessageModel, QuestionModel, SliceType, SlideModel } from '@app/domain/PresentationModel';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Radio, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { ChatBox } from '../ChatBox/ChatBox';
import { QuestionBox } from '../QuestionBox/QuestionBox';
import { PresSlide } from '../Slide/PresSlide';
import * as S from './GroupPresentation.styles';

export const GroupPresentation = ({ code, socket, onStop }: { code: string; socket: Socket; onStop: () => void }) => {
  const user = useAppSelector((state) => state.user.user);

  const [slide, setSlide] = useState<SlideModel>({} as SlideModel);
  const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * 1000000));
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chats, setChats] = useState<MessageModel[]>([] as MessageModel[]);
  const [questions, setQuestions] = useState<QuestionModel[]>([] as QuestionModel[]);
  const [chatVisible, setChatVisible] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [chatNotify, setChatNotify] = useState(0);
  const [questionNotify, setQuestionNotify] = useState(0);

  useEffect(() => {
    setChatNotify(0);
  }, [chatVisible]);

  useEffect(() => {
    setQuestionNotify(0);
  }, [questionVisible]);

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
      setChatNotify((prev) => prev + 1);
    });
    socket.on(`presentation:${code}:question`, (data) => {
      setQuestions((prev) => [data, ...prev]);
      setQuestionNotify((prev) => prev + 1);
    });
    socket.on(`presentation:${code}:upvotequestion`, (data) => {
      setQuestions((prev) => prev.map((q) => (q.id === data.id ? data : q)));
    });
    socket.on(`presentation:${code}:stop`, () => {
      setSlide({} as SlideModel);
      notificationController.info({ message: 'Presentation has been stopped' });
      socket.removeListener(`presentation:${code}:slide`);
      socket.removeListener(`presentation:${code}:chat`);
      socket.removeListener(`presentation:${code}:stop`);
      onStop();
    });
  };

  useEffect(() => {
    listen(code);
    socket.emit('presentation:join', { code: code, userId: user?.id, randomNumber: randomNumber });
    socket.on(`presentation:${randomNumber}:oldchat`, (data) => {
      setChats((prev) => {
        return [...prev, ...data];
      });
    });
    socket.on(`presentation:${randomNumber}:oldquestion`, (data) => {
      setQuestions((prev) => {
        return [...prev, ...data];
      });
    });

    return () => {
      socket.removeListener(`presentation:${randomNumber}:oldchat`);
    };
  }, []);

  const handleOptionsChange = (e: any) => {
    if (isAnswered) return;
    socket.emit('presentation:answer', { code: code, answer: e.target.value, userId: user?.id });
    setIsAnswered(true);
  };

  const handleSendMessage = (message: string) => {
    socket.emit('presentation:chat', { code: code, message: message, userId: user?.id });
  };

  const handleLoadMore = (page: number) => {
    socket.emit('presentation:oldchat', { code: code, page: page, randomNumber: randomNumber });
  };

  const handleSendQuestion = (question: string) => {
    socket.emit('presentation:question', { code: code, question: question, userId: user?.id });
  };

  const handleLoadMoreQuestion = (page: number) => {
    socket.emit('presentation:oldquestion', { code: code, page: page, randomNumber: randomNumber });
  };

  return (
    <S.Container $isFullScreen={isFullscreen}>
      <PresSlide slide={slide} />
      {slide.type === SliceType.MULTIPLE_CHOICE &&
      slide.options &&
      !isAnswered &&
      (!slide.answers || !slide.answers.find((a) => (a.user.id ? a.user.id : a.user) === user?.id)) ? (
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
        <S.Options>
          <div>Answered</div>
        </S.Options>
      )}
      <ChatBox
        visible={chatVisible}
        onSendMesage={handleSendMessage}
        onChatVisible={setChatVisible}
        onLoadMore={handleLoadMore}
        chats={chats}
      />

      <QuestionBox
        visible={questionVisible}
        onSendQuestion={handleSendQuestion}
        onQuestionVisible={setQuestionVisible}
        onLoadMore={handleLoadMoreQuestion}
        questions={questions}
        isOwner={false}
        identifier={user?.id || randomNumber.toString()}
        toggleVote={(id) => {
          socket.emit('presentation:vote', {
            code: code,
            questionId: id,
            userId: user?.id,
            randomNumber: randomNumber,
          });
        }}
      />

      <S.FloatButton>
        <div onClick={() => setQuestionVisible(!questionVisible)}>
          <QuestionCircleOutlined />
          {!questionVisible && questionNotify > 0 && <S.Notify>{questionNotify}</S.Notify>}
        </div>
        <div onClick={() => setChatVisible(!chatVisible)}>
          <MessageOutlined />
          {!chatVisible && chatNotify > 0 ? <S.Notify>{chatNotify}</S.Notify> : null}
        </div>
        <div onClick={() => setIsFullscreen(!isFullscreen)}>
          {isFullscreen ? <FullscreenExitOutlined /> : <ExpandOutlined />}
        </div>
      </S.FloatButton>
    </S.Container>
  );
};
