import { PlusCircleOutlined, QuestionCircleFilled } from '@ant-design/icons';
import {
  addSlice,
  deletePresentation,
  deleteSlice,
  getPresentation,
  getPresentationById,
  showPresentation,
  updateSlice,
} from '@app/api/presentation.api';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Select } from '@app/components/common/selects/Select/Select';
import { AnswersModal } from '@app/components/presentations/AnswersModal';
import { CollaboratorModal } from '@app/components/presentations/CollaboratorModal';
import { GroupChooseModal } from '@app/components/presentations/GroupChooseModal';
import { MultiChoiceContentForm } from '@app/components/presentations/MultiChoiceContentForm/MultiChoiceContentForm';
import { PresSlide } from '@app/components/presentations/Slide/PresSlide';
import { Slide } from '@app/components/presentations/Slide/PresSlide.styles';
import { notificationController } from '@app/controllers/notificationController';
import { PresentationModel, SlideModel, SliceType } from '@app/domain/PresentationModel';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { useResponsive } from '@app/hooks/useResponsive';
import { setPresentation as reduxSetPresentation } from '@app/store/slices/presentationSlice';
import { Button, Row, Tabs, Form, Modal, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import * as S from './PresentationPage.styles';

export const PresentationPage = ({ socket }: { socket: Socket }) => {
  const { isDesktop } = useResponsive();
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [form] = Form.useForm();

  const [presentation, setPresentation] = useState<PresentationModel | null>(null);
  const [selectedSlice, setSelectedSlice] = useState<SlideModel | null>(null);
  const [showColapModal, setShowColapModal] = useState(false);
  const [showGroupChooseModal, setShowGroupChooseModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      getPresentationById(params.id)
        .then((data) => {
          setPresentation(data as unknown as PresentationModel);
          if (data && data.slices.length > 0) {
            setSelectedSlice(data.slices[0]);
          }
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
    if (selectedSlice) {
      form.setFieldsValue(selectedSlice);
    }
  }, [selectedSlice]);

  const handleAddSlice = () => {
    if (!presentation) return;
    addSlice(presentation.id)
      .then((data) => {
        setPresentation(data as unknown as PresentationModel);
      })
      .catch((err) => {
        notificationController.error({ message: 'Error adding slice' });
        console.log(err);
      });
  };

  const handleSaveSlice = (value: any) => {
    if (!presentation || !selectedSlice) return;
    updateSlice(presentation?.id, selectedSlice?.id, value)
      .then(() => {
        getPresentationById(presentation?.id)
          .then((data) => {
            setPresentation(data as unknown as PresentationModel);
            const newSlice = data.slices.find((s) => s.id === selectedSlice.id);
            if (!newSlice) return;
            const sliceIndex = data.slices.indexOf(newSlice);
            if (!selectedSlice) {
              if (data && data.slices.length > 0) {
                setSelectedSlice(data.slices[0]);
              } else {
                setSelectedSlice(null);
              }
            } else {
              setSelectedSlice(newSlice || null);
            }
            if (data.isShowing) {
              socket.emit('presentation:updateSlide', {
                code: data.code,
                data: { slice: newSlice, number: sliceIndex },
              });
            }
          })
          .catch((err) => {
            notificationController.error({ message: "You can't access this presentation." });
            console.log(err);
          });
      })
      .catch((err) => {
        notificationController.error({ message: 'Error updating slice' });
        console.log(err);
      });
  };

  const handleDeleteSlice = (id: string) => {
    if (!presentation || !selectedSlice) return;
    deleteSlice(presentation?.id, id)
      .then(() => {
        getPresentationById(presentation?.id)
          .then((data) => {
            setPresentation(data as unknown as PresentationModel);
            if (!selectedSlice || selectedSlice.id === id) {
              if (data && data.slices.length > 0) {
                setSelectedSlice(data.slices[0]);
              } else {
                setSelectedSlice(null);
              }
            }
          })
          .catch((err) => {
            notificationController.error({ message: "You can't access this presentation." });
            console.log(err);
          });
      })
      .catch((err) => {
        notificationController.error({ message: 'Error deleting slice' });
        console.log(err);
      });
  };

  const handleShowPresentation = () => {
    if (!presentation) return;
    showPresentation(presentation.id).then(() => {
      setPresentation({ ...presentation, isShowing: !presentation.isShowing });
      if (presentation.isShowing) {
        socket.emit('presentation:stop', { code: presentation.code });
        notificationController.success({ message: 'Presentation is now hidden' });
      } else {
        notificationController.success({ message: 'Presentation is now visible' });
        window.open(`/show/${presentation.id}`, '_blank');
      }
    });
  };

  const handleDeletePresentation = () => {
    if (!presentation) return;
    deletePresentation(presentation?.id)
      .then(() => {
        getPresentation().then((data) => {
          dispatch(reduxSetPresentation(data));
        });
        notificationController.success({ message: 'Presentation deleted successfully' });
        navigate('/');
      })
      .catch((err) => {
        notificationController.error({ message: 'Error deleting presentation' });
        console.log(err);
      });
  };

  const desktopLayout = (
    <S.Row>
      <S.LeftSideCol xl={17} xxl={18} id="desktop-content">
        <S.SliceNav>
          <S.Tabs
            type="editable-card"
            tabPosition="left"
            tabBarStyle={{
              padding: '0',
            }}
            onChange={(id: string) => {
              if (presentation) {
                setSelectedSlice(presentation.slices.find((slice) => slice.id === id) || null);
              }
            }}
            onEdit={(targetKey, action) => {
              if (action === 'add') {
                handleAddSlice();
              } else if (action === 'remove') {
                handleDeleteSlice(targetKey.toString());
              }
            }}
          >
            {presentation?.slices.map((slice, index) => {
              return (
                <Tabs.TabPane tab={<PresSlide slide={slice} isPreview={true} />} key={slice.id}>
                  <PresSlide slide={slice} />
                </Tabs.TabPane>
              );
            })}
          </S.Tabs>
        </S.SliceNav>
        <S.PresentationAction>
          <div></div>
          {presentation && user?.id === presentation.owner.toString() && (
            <>
              <Button htmlType="button" danger onClick={handleDeletePresentation}>
                Delete Presentation
              </Button>

              <Button
                htmlType="button"
                type="dashed"
                onClick={() => {
                  setShowColapModal(true);
                }}
              >
                Manage Collaborators
              </Button>
            </>
          )}
          {selectedSlice?.type === SliceType.MULTIPLE_CHOICE ? (
            <Button
              htmlType="button"
              onClick={() => {
                setShowAnswerModal(true);
              }}
            >
              View Answers
            </Button>
          ) : null}
          {presentation?.isShowing ? (
            <span>
              The presentaion is now showing.
              <Link to={`/show/${presentation?.id}`}>Click here</Link> to continue present.
            </span>
          ) : null}
          {presentation?.isShowing ? (
            <Button htmlType="button" type="primary" onClick={handleShowPresentation}>
              Stop
            </Button>
          ) : (
            <Popconfirm
              placement="top"
              title={'Where do you want to present ?'}
              icon={<QuestionCircleFilled />}
              onConfirm={handleShowPresentation}
              onCancel={() => {
                setShowGroupChooseModal(true);
              }}
              okText="Public"
              cancelText="Group"
            >
              <Button htmlType="button" type="primary">
                Present
              </Button>
            </Popconfirm>
          )}
        </S.PresentationAction>
      </S.LeftSideCol>
      {/* {selectedSlice ? <PresSlide slide={selectedSlice} /> : null} */}

      <S.RightSideCol xl={7} xxl={6}>
        <S.Wrapper>
          {selectedSlice ? (
            <S.Form layout="vertical" onFinish={handleSaveSlice} form={form}>
              <BaseForm.Item
                label="Select Type"
                name={'type'}
                rules={[{ required: true, message: 'Type is required' }]}
              >
                <Select
                  placeholder="Select Type"
                  onChange={(value) => {
                    setSelectedSlice({
                      ...selectedSlice,
                      type: value as SliceType,
                    });
                  }}
                  options={[
                    {
                      value: SliceType.MULTIPLE_CHOICE,
                      label: 'Multiple Choice',
                    },
                    {
                      value: SliceType.HEADING,
                      label: 'Heading',
                    },
                    {
                      value: SliceType.PARAGRAGH,
                      label: 'Paragraph',
                    },
                  ]}
                />
              </BaseForm.Item>
              <S.Divider />
              <S.ContentSection>
                {selectedSlice.type === SliceType.MULTIPLE_CHOICE && (
                  <MultiChoiceContentForm options={selectedSlice.options} />
                )}
                {selectedSlice.type === SliceType.HEADING && null}
                {selectedSlice.type === SliceType.PARAGRAGH && null}
              </S.ContentSection>
              <BaseForm.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button htmlType="button" danger onClick={() => handleDeleteSlice(selectedSlice.id)}>
                    Delete
                  </Button>
                  <Button htmlType="submit" type="primary">
                    Save
                  </Button>
                </div>
              </BaseForm.Item>
            </S.Form>
          ) : (
            'Select a slice to edit'
          )}
        </S.Wrapper>
      </S.RightSideCol>
      {presentation && user?.id === presentation.owner.toString() ? (
        <CollaboratorModal
          presentationId={presentation?.id || ''}
          visible={showColapModal}
          onOk={() => {
            setShowColapModal(false);
          }}
          onCancel={() => {
            setShowColapModal(false);
          }}
        />
      ) : null}
      {presentation && (
        <GroupChooseModal
          visible={showGroupChooseModal}
          onOk={(groups) => {
            setShowGroupChooseModal(false);
            setPresentation({ ...presentation, isShowing: true, isShowInGroup: true });
            socket.emit('presentation:present', { presentationName: presentation.name, groups });
            window.open(`/show/${presentation.id}`, '_blank');
          }}
          onCancel={() => {
            setShowGroupChooseModal(false);
          }}
          presentationId={presentation.id}
        />
      )}
      {selectedSlice?.type === SliceType.MULTIPLE_CHOICE ? (
        <AnswersModal
          visible={showAnswerModal}
          onOk={() => {
            setShowAnswerModal(false);
          }}
          onCancel={() => {
            setShowAnswerModal(false);
          }}
          answers={selectedSlice.answers}
        />
      ) : null}
    </S.Row>
  );

  return (
    <>
      <PageTitle>{presentation ? presentation.name : 'Presentation'}</PageTitle>
      {desktopLayout}
    </>
  );
};
