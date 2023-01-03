import { ExpandOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { notificationController } from '@app/controllers/notificationController';
import { SliceType, SlideModel } from '@app/domain/PresentationModel';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Radio, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { PresSlide } from '../Slide/PresSlide';
import * as S from './GroupPresentation.styles';

export const GroupPresentation = ({ code, socket }: { code: string; socket: Socket }) => {
  const [slide, setSlide] = useState<SlideModel>({} as SlideModel);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const user = useAppSelector((state) => state.user.user);

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
    socket.on(`presentation:${code}:stop`, () => {
      setSlide({} as SlideModel);
      notificationController.info({ message: 'Presentation has been stopped' });
    });
  };

  useEffect(() => {
    listenToUpdateSlide(code);
    socket.emit('presentation:join', code);
  }, []);
  const handleOptionsChange = (e: any) => {
    if (isAnswered) return;
    socket.emit('presentation:answer', { code: code, answer: e.target.value, userId: user?.id });
    setIsAnswered(true);
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
      <S.FloatButton>
        {isFullscreen ? (
          <FullscreenExitOutlined onClick={() => setIsFullscreen(false)} />
        ) : (
          <ExpandOutlined onClick={() => setIsFullscreen(true)} />
        )}
      </S.FloatButton>
    </S.Container>
  );
};
