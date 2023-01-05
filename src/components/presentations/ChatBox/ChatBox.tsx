import { MinusOutlined, SendOutlined } from '@ant-design/icons';
import { MessageModel } from '@app/domain/PresentationModel';
import { Typography, Input, Comment, Spin } from 'antd';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import * as S from './ChatBox.styles';

export const ChatBox = ({
  visible,
  chats,
  onSendMesage,
  onChatVisible,
  onLoadMore,
}: {
  visible: boolean;
  chats: MessageModel[];
  onSendMesage: (value: string) => void;
  onChatVisible: (value: boolean) => void;
  onLoadMore: (page: number) => void;
}) => {
  const [message, setMessage] = useState('');
  const chatlistRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [isLoading, setIsLoading] = useState(true);
  const chatPage = useRef(1);

  useEffect(() => {
    if (chatlistRef.current) {
      const element = chatlistRef.current as HTMLElement;
      element.addEventListener('scroll', () => {
        if (element.scrollTop <= element.clientHeight - element.scrollHeight + 10) {
          setIsLoading(true);
          onLoadMore(chatPage.current);
          chatPage.current = chatPage.current + 1;
        }
      });
    }

    return () => {
      if (chatlistRef.current) {
        const element = chatlistRef.current as HTMLElement;
        element.removeEventListener('scroll', () => {
          if (element.scrollTop === element.clientHeight - element.scrollHeight) {
            onLoadMore(chatPage.current);
            chatPage.current = chatPage.current + 1;
          }
        });
      }
    };
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [chats]);
  return (
    <S.Float $visible={visible}>
      <Draggable handle="#handle">
        <S.ChatBox>
          <S.ChatHeader id="handle">
            <Typography style={{ fontSize: '16px' }}>ChatBox</Typography>
            <S.ChatAcion>
              <MinusOutlined onClick={() => onChatVisible(false)} />
            </S.ChatAcion>
          </S.ChatHeader>
          <S.ChatList ref={chatlistRef}>
            {chats.map((chat) => (
              <Comment
                key={chat.id}
                author={chat.user ? chat.user.email : 'anonymous'}
                content={chat.message}
                datetime={new Date(chat.createdAt).toLocaleString()}
              />
            ))}
            {isLoading && <Spin />}
          </S.ChatList>
          <S.ChatInput>
            <Input
              suffix={
                <SendOutlined
                  onClick={() => {
                    onSendMesage(message);
                    setMessage('');
                  }}
                />
              }
              value={message}
              onChange={(e) => setMessage(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSendMesage(message);
                  setMessage('');
                }
              }}
            />
          </S.ChatInput>
        </S.ChatBox>
      </Draggable>
    </S.Float>
  );
};
