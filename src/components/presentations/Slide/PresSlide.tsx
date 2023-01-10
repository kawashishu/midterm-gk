import { Card } from '@app/components/common/Card/Card';
import { BaseChart, getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';
import { SliceType, SlideModel } from '@app/domain/PresentationModel';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import * as S from './PresSlide.styles';
const COLORS = ['#E97777', '#FCDDB0', '#FFFAD7', '#F7A4A4', '#FEBE8C', '#FEBE8C', '#B6E2A1', '#FF9F9F'];

export const PresSlide = ({
  slide,
  isPreview,
  isPresent,
  code,
}: {
  slide: SlideModel;
  isPreview?: boolean;
  isPresent?: boolean;
  code?: string;
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const option = {
    tooltip: {
      ...getDefaultTooltipStyles(themeObject[theme]),
      trigger: 'axis',
      crossStyle: {
        color: 'red',
      },
    },
    grid: {
      top: 30,
      left: 0,
      right: 0,
      bottom: 0,
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: slide?.options?.map((option) => option.name),
        axisLabel: {
          color: (value: any, index: number) => COLORS[index % COLORS.length],
          fontSize: 16,
        },
      },
    ],
    yAxis: [
      {
        show: false,
        type: 'value',
      },
    ],
    series: [
      {
        type: 'bar',
        itemStyle: {
          color: (params: any) => COLORS[params.dataIndex % COLORS.length],
        },
        data: slide?.options?.map((option) => option.count),
        label: {
          show: true,
          position: 'top',
          color: (params: any) => COLORS[params.dataIndex % COLORS.length],
          fontSize: 16,
        },
      },
    ],
  };
  return isPreview ? (
    <S.PreviewSlide $autoHeight={false} $padding={0}>
      <S.PreviewSlideBody>
        <h1>{slide.type}</h1>
        <span>{slide.heading}</span>
      </S.PreviewSlideBody>
    </S.PreviewSlide>
  ) : (
    <S.Slide $autoHeight={false} $padding={10}>
      <S.SildeBody>
        {isPresent && (
          <span>
            Access <a href={`${window.origin}/public`}>{window.origin}/public</a> and input this code {code} to join!
          </span>
        )}
        <h1>{slide.heading}</h1>
        <h2>{slide.subHeading}</h2>
        <p>{slide.content}</p>
        {slide.type === SliceType.MULTIPLE_CHOICE ? <BaseChart option={option} width="80%" /> : null}
      </S.SildeBody>
    </S.Slide>
  );
};
