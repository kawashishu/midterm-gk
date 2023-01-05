import { PlusOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { createGroup, getGroups } from '@app/api/group.api';
import { createPresentation, getPresentation } from '@app/api/presentation.api';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { notificationController } from '@app/controllers/notificationController';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { setGroups } from '@app/store/slices/groupSlice';
import { setPresentation } from '@app/store/slices/presentationSlice';
import { Button, Modal, Typography, Input } from 'antd';
import { ReactComponent as PresentationIcon } from '@app/assets/icons/presentation.svg';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as S from '../Header.styles';
import { useResponsive } from '@app/hooks/useResponsive';

export const Creatation = () => {
  const [value, setValue] = useState('');
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDesktop } = useResponsive();
  const [groupVisible, setGroupVisible] = useState(false);
  const [presentationVisible, setPresentationVisible] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handleCreateGroup = (e: any) => {
    e.preventDefault();
    if (!value) {
      notificationController.error({ message: 'Group name must not be empty' });
      return;
    }
    createGroup(value)
      .then((res) => {
        getGroups().then((data) => {
          dispatch(setGroups(data));
        });
        notificationController.success({ message: 'Group created successfully' });
        navigate(`/group/${(res as any).id}`);
        setGroupVisible(false);
      })
      .catch((err) => {
        console.log(err);
        notificationController.error({ message: 'Group creation failed' });
      });
  };

  const handleCreatePresentation = (e: any) => {
    createPresentation(e.name)
      .then((res) => {
        getPresentation().then((data) => {
          dispatch(setPresentation(data));
          notificationController.success({ message: 'Presentation created successfully' });
          navigate(`/presentation/${(res as any).id}`);
        });
      })
      .catch((err) => {
        console.log(err);
        notificationController.error({ message: 'Presentation creation failed' });
      });
  };
  return (
    <S.SearchColumn xl={7} xxl={6}>
      <Button size="small" onClick={() => setGroupVisible(true)}>
        <UsergroupAddOutlined size={16} /> {!isDesktop ? <PlusOutlined /> : 'New group'}
      </Button>
      <Button
        size="small"
        style={{ display: 'flex', alignItems: 'center' }}
        onClick={() => setPresentationVisible(true)}
      >
        <PresentationIcon style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} />{' '}
        {!isDesktop ? <PlusOutlined /> : 'New Presentation'}
      </Button>
      <Modal
        visible={groupVisible}
        onOk={handleCreateGroup}
        onCancel={() => setGroupVisible(false)}
        footer={
          <Button type="primary" onClick={handleCreateGroup}>
            Ok
          </Button>
        }
      >
        <S.Wrapper>
          <Typography.Title level={2}>NEW GROUP</Typography.Title>
          <S.Form id="desktop-form">
            <Input name="name" onChange={onChange} placeholder="name" />
          </S.Form>
        </S.Wrapper>
      </Modal>
      <Modal visible={presentationVisible} onCancel={() => setPresentationVisible(false)} footer={null}>
        <S.Wrapper>
          <Typography.Title level={2}>{t('presentation.create')}</Typography.Title>
          <BaseForm onFinish={handleCreatePresentation}>
            <BaseForm.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required!' }]}>
              <Input placeholder="name" />
            </BaseForm.Item>
            <BaseForm.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Create
              </Button>
            </BaseForm.Item>
          </BaseForm>
        </S.Wrapper>
      </Modal>
    </S.SearchColumn>
  );
};
