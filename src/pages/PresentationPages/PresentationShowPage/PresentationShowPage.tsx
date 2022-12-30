import { getPresentationById } from '@app/api/presentation.api';
import { PresSlide } from '@app/components/presentations/Slide/PresSlide';
import { notificationController } from '@app/controllers/notificationController';
import { PresentationModel, SlideModel } from '@app/domain/PresentationModel';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import * as S from './PresentationShowPage.styles';

export const PresentationShowPage = ({ socket }: { socket: Socket }) => {
  const params = useParams();
  const navigate = useNavigate();

  const [presentation, setPresentation] = useState<PresentationModel | null>(null);
  const [selectedSlice, setSelectedSlice] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(socket.connected);

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
    if (params.id) {
      getPresentationById(params.id)
        .then((data) => {
          if (!data) navigate(`/`);
          if (!data.isShowing) {
            navigate(`/presentation/${data.id}`);
          }
          setPresentation(data as unknown as PresentationModel);
          listen(data.code);
          socket.emit('presentation:slide', { code: data.code, slide: data.slices[selectedSlice] });
        })
        .catch((err) => {
          notificationController.error({ message: "You can't access this presentation." });
          console.log(err);
        });
    } else {
      notificationController.error({ message: 'Missing presentation id' });
    }
  }, [params]);

  useEffect(() => {
    if (!isConnected) return;
    if (!presentation) return;
    socket.emit('presentation:slide', { code: presentation?.code, slide: presentation.slices[selectedSlice] });
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
      console.log(data);
      setPresentation((prev) => {
        if (!prev) return null;
        console.log(prev.slices);
        const { number, slice } = data;
        const newData = [...prev.slices];
        newData[number] = slice;
        return { ...prev, slices: newData };
      });
    });
  };

  return (
    <S.Container>
      {presentation?.slices[selectedSlice] ? (
        <PresSlide slide={presentation?.slices[selectedSlice]} isPresent={true} code={presentation.code} />
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
    </S.Container>
  );
};
