import { MessageOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { getPresentationById } from '@app/api/presentation.api';
import { ChatBox } from '@app/components/presentations/ChatBox/ChatBox';
import { QuestionBox } from '@app/components/presentations/QuestionBox/QuestionBox';
import { PresSlide } from '@app/components/presentations/Slide/PresSlide';
import { notificationController } from '@app/controllers/notificationController';
import { MessageModel, PresentationModel, QuestionModel, SlideModel } from '@app/domain/PresentationModel';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import * as S from './PresentationShowPage.styles';

export const PresentationShowPage = ({ socket }: { socket: Socket }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);

  const [presentation, setPresentation] = useState<PresentationModel | null>(null);
  const [isLoadPresentation, setIsLoadPresentation] = useState(false);
  const [selectedSlice, setSelectedSlice] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [chats, setChats] = useState<MessageModel[]>([] as MessageModel[]);
  const [chatVisible, setChatVisible] = useState(false);
  const [questions, setQuestions] = useState<QuestionModel[]>([] as QuestionModel[]);
  const [questionVisible, setQuestionVisible] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    if (isLoadPresentation) return;
    if (params.id) {
      setIsLoadPresentation(true);
      getPresentationById(params.id)
        .then((data) => {
          if (!data) navigate(`/`);
          if (!data.isShowing) {
            navigate(`/presentation/${data.id}`);
          }
          setPresentation(data as unknown as PresentationModel);
          listen(data.code);
          socket.emit('presentation:slide', { code: data.code, slide: data.slices[selectedSlice] });
          setIsLoadPresentation(false);
        })
        .catch((err) => {
          notificationController.error({ message: "You can't access this presentation." });
          console.log(err);
          setIsLoadPresentation(false);
        });
    } else {
      notificationController.error({ message: 'Missing presentation id' });
      setIsLoadPresentation(false);
    }
  }, [params]);

  useEffect(() => {
    if (!isConnected) return;
    if (!presentation) return;
    socket.emit('presentation:slide', { code: presentation?.code, slide: presentation.slices[selectedSlice] });
    socket.emit('presentation:join', { code: presentation?.code, randomNumber: user?.id });
  }, [selectedSlice, presentation]);

  const listen = (code: string) => {
    socket.on(`presentation:${code}:answer`, (data: SlideModel) => {
      setPresentation((prev) => {
        if (!prev) return null;
        const newSlices = prev.slices.map((slice) => {
          if (slice.id === data.id) return data;
          return slice;
        });
        return { ...prev, slices: newSlices };
      });
      socket.emit('presentation:slide', { code: code, slide: data });
    });

    socket.on(`presentation:${code}:updateSlide`, (data: any) => {
      setPresentation((prev) => {
        if (!prev) return null;
        const { number, slice } = data;
        const newData = [...prev.slices];
        newData[number] = slice;
        return { ...prev, slices: newData };
      });
    });
    socket.on(`presentation:${code}:chat`, (data) => {
      setChats((prev) => [data, ...prev]);
    });
    socket.on(`presentation:${user?.id}:oldchat`, (data) => {
      setChats((prev) => {
        return [...prev, ...data];
      });
    });
    socket.on(`presentation:${user?.id}:oldquestion`, (data) => {
      setQuestions((prev) => {
        return [...prev, ...data];
      });
    });
    socket.on(`presentation:${code}:question`, (data) => {
      setQuestions((prev) => [data, ...prev]);
    });
    socket.on(`presentation:${code}:upvotequestion`, (data) => {
      setQuestions((prev) => prev.map((q) => (q.id === data.id ? data : q)));
    });
    socket.on(`presentation:${code}:stop`, () => {
      notificationController.info({ message: 'Presentation has been stopped' });
      window.open('about:blank', '_self');
      window.close();
    });
  };
  // const handleSendMessage = (message: string) => {
  //   socket.emit('presentation:chat', { code: presentation?.code, message: message, userId: user?.id });
  // };

  // const handleLoadMore = (page: number) => {
  //   socket.emit('presentation:oldchat', { code: presentation?.code, page: page, randomNumber: user?.id });
  // };
  return (
    <S.Container>
      {presentation?.slices[selectedSlice] ? (
        <PresSlide
          slide={presentation?.slices[selectedSlice]}
          isPresent={!presentation.isShowInGroup}
          code={presentation.code}
        />
      ) : null}
      <S.Action>
        <Button
          onClick={() => {
            if (selectedSlice > 0) setSelectedSlice(selectedSlice - 1);
          }}
          disabled={selectedSlice === 0}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            if (!presentation) return;
            if (presentation?.slices.length === 0) return;
            if (selectedSlice < presentation.slices.length - 1) setSelectedSlice(selectedSlice + 1);
          }}
          disabled={!presentation || selectedSlice === presentation?.slices.length - 1}
        >
          Next
        </Button>
      </S.Action>
      {presentation?.id ? (
        <>
        <ChatBox
          visible={chatVisible}
          onSendMesage={(message: string) => {
            socket.emit('presentation:chat', { code: presentation?.code, message: message, userId: user?.id });
          }}
          onChatVisible={setChatVisible}
          onLoadMore={(page: number) => {
            socket.emit('presentation:oldchat', { code: presentation?.code, page: page, randomNumber: user?.id });
          }}
          chats={chats}
        />
        <QuestionBox
            visible={questionVisible}
            onSendQuestion={(message: string) => {
              socket.emit('presentation:question', { code: presentation?.code, message: message, userId: user?.id });
            } }
            onQuestionVisible={setQuestionVisible}
            onLoadMore={(page: number) => {
              socket.emit('presentation:oldquestion', { code: presentation?.code, page: page, randomNumber: user?.id });
            } }
            questions={questions}
            isOwner={true} 
            identifier={user?.id || ''} 
            answered= {(id: string) => {
              socket.emit('presentation:question:answered', { code: presentation?.code, questionId: id });
            }}
        />
        </>
      ) : null}
      <S.FloatButton>
      <div>
          <QuestionCircleOutlined onClick={() => setQuestionVisible(!chatVisible)} />
        </div>
        <div>
          <MessageOutlined onClick={() => setChatVisible(!chatVisible)} />
        </div>
      </S.FloatButton>
    </S.Container>
  );
};
