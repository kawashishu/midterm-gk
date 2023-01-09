import {
  CheckCircleFilled,
  CheckCircleOutlined,
  LikeFilled,
  LikeOutlined,
  MinusOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { QuestionModel } from '@app/domain/PresentationModel';
import { Typography, Input, Comment, Spin } from 'antd';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import * as S from './QuestionBox.styles';

export const QuestionBox = ({
  visible,
  questions,
  onSendQuestion,
  onQuestionVisible,
  onLoadMore,
  isOwner,
  identifier,
  toggleVote,
  answered,
}: {
  visible: boolean;
  questions: QuestionModel[];
  onSendQuestion: (value: string) => void;
  onQuestionVisible: (value: boolean) => void;
  onLoadMore: (page: number) => void;
  isOwner: boolean;
  identifier: string;
  toggleVote?: (questionId: string) => void;
  answered?: (id: string) => void;
}) => {
  const [Question, setQuestion] = useState('');
  const QuestionlistRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [isLoading, setIsLoading] = useState(true);
  const QuestionPage = useRef(1);

  useEffect(() => {
    if (QuestionlistRef.current) {
      const element = QuestionlistRef.current as HTMLElement;
      element.addEventListener('scroll', () => {
        if (element.scrollTop >= element.scrollHeight - element.clientHeight - 10) {
          setIsLoading(true);
          onLoadMore(QuestionPage.current);
          QuestionPage.current = QuestionPage.current + 1;
        }
      });
    }

    return () => {
      if (QuestionlistRef.current) {
        const element = QuestionlistRef.current as HTMLElement;
        element.removeEventListener('scroll', () => {
          if (element.scrollTop === element.clientHeight - element.scrollHeight) {
            onLoadMore(QuestionPage.current);
            QuestionPage.current = QuestionPage.current + 1;
          }
        });
      }
    };
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [questions]);
  return (
    <S.Float $visible={visible}>
      <Draggable handle="#handle">
        <S.QuestionBox>
          <S.QuestionHeader id="handle">
            <Typography style={{ fontSize: '16px' }}>QuestionBox</Typography>
            <S.QuestionAcion>
              <MinusOutlined onClick={() => onQuestionVisible(false)} />
            </S.QuestionAcion>
          </S.QuestionHeader>
          <S.QuestionList ref={QuestionlistRef}>
            {questions.sort(sortQuestion).map((Question) => (
              <S.Question key={Question.id}>
                <span style={{ textDecoration: Question.answered ? 'line-through' : '' }}>{Question.question}</span>
                <S.LikeSection>
                  <span>{Question.upvotes}</span>
                  {isOwner ? (
                    Question.answered ? (
                      <CheckCircleOutlined style={{ color: 'green' }} />
                    ) : (
                      <CheckCircleOutlined
                        onClick={() => {
                          answered && answered(Question.id);
                        }}
                      />
                    )
                  ) : (
                    <>
                      {Question.voted && Question.voted.includes(identifier) ? (
                        <LikeFilled onClick={() => toggleVote && toggleVote(Question.id)} style={{ color: 'red' }} />
                      ) : (
                        <LikeOutlined onClick={() => toggleVote && toggleVote(Question.id)} />
                      )}
                    </>
                  )}
                </S.LikeSection>
              </S.Question>
            ))}
            {isLoading && <Spin />}
          </S.QuestionList>
          {!isOwner ? (
            <S.QuestionInput>
              <Input
                suffix={
                  <SendOutlined
                    onClick={() => {
                      onSendQuestion(Question);
                      setQuestion('');
                    }}
                  />
                }
                value={Question}
                onChange={(e) => setQuestion(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSendQuestion(Question);
                    setQuestion('');
                  }
                }}
              />
            </S.QuestionInput>
          ) : null}
        </S.QuestionBox>
      </Draggable>
    </S.Float>
  );
};

const sortQuestion = (a: QuestionModel, b: QuestionModel) => {
  if (a.answered && !b.answered) {
    return 1;
  } else if (!a.answered && b.answered) {
    return -1;
  }
  if (a.upvotes > b.upvotes) {
    return -1;
  } else if (a.upvotes < b.upvotes) {
    return 1;
  }
  const aDate = new Date(a.createdAt);
  const bDate = new Date(b.createdAt);
  if (aDate > bDate) {
    return -1;
  } else {
    return 1;
  }
};
