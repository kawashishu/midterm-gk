import { PlusCircleOutlined } from '@ant-design/icons';
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
import { CollaboratorModal } from '@app/components/presentations/CollaboratorModal';
import { MultiChoiceContentForm } from '@app/components/presentations/MultiChoiceContentForm/MultiChoiceContentForm';
import { PresSlide } from '@app/components/presentations/Slide/PresSlide';
import { notificationController } from '@app/controllers/notificationController';
import { PresentationModel, SlideModel, SliceType } from '@app/domain/PresentationModel';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { useResponsive } from '@app/hooks/useResponsive';
import { setPresentation as reduxSetPresentation } from '@app/store/slices/presentationSlice';
import { Button, Row, Tabs, Form, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as S from './PresentationPage.styles';

export const PresentationPage = () => {
  const { isDesktop } = useResponsive();
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [form] = Form.useForm();

  const [presentation, setPresentation] = useState<PresentationModel | null>(null);
  const [selectedSlice, setSelectedSlice] = useState<SlideModel | null>(null);
  const [showColapModal, setShowColapModal] = useState(false);

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
            if (!selectedSlice) {
              if (data && data.slices.length > 0) {
                setSelectedSlice(data.slices[0]);
              } else {
                setSelectedSlice(null);
              }
            } else {
              setSelectedSlice(data.slices.find((s) => s.id === selectedSlice.id) || null);
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
      presentation.isShowing
        ? notificationController.success({ message: 'Presentation is now hidden' })
        : notificationController.success({ message: 'Presentation is now visible' });
      navigate(`/show/${presentation.id}`);
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
    <Row>
      <S.LeftSideCol xl={16} xxl={17} id="desktop-content">
        <S.SliceNav>
          <Tabs
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
          </Tabs>
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
          {presentation?.isShowing ? (
            <span>
              The presentaion is now showing.
              <Link to={`/show/${presentation?.id}`}>Click here</Link> to continue present.
            </span>
          ) : null}
          <Button htmlType="button" type="primary" onClick={handleShowPresentation}>
            {presentation?.isShowing ? 'Stop' : 'Present'}
          </Button>
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
    </Row>
  );

  return (
    <>
      <PageTitle>{presentation ? presentation.name : 'Presentation'}</PageTitle>
      {desktopLayout}
    </>
  );
};
