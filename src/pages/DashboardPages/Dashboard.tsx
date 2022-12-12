import { createGroup, getGroups } from '@app/api/group.api';
import { createPresentation, getPresentation } from '@app/api/presentation.api';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { notificationController } from '@app/controllers/notificationController';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { useResponsive } from '@app/hooks/useResponsive';
import { readToken } from '@app/services/localStorage.service';
import { setGroups } from '@app/store/slices/groupSlice';
import { setPresentation } from '@app/store/slices/presentationSlice';
import { Button, Input, Row, Typography } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as S from './DashboardPage.styles';

export const Dashboard = () => {
  const { isDesktop } = useResponsive();

  const [value, setValue] = useState('');
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handleCreateGroup = (e: any) => {
    e.preventDefault();
    if (!value) {
      return;
    }
    createGroup(value)
      .then((res) => {
        getGroups().then((data) => {
          dispatch(setGroups(data));
        });
        notificationController.success({ message: 'Group created successfully' });
        navigate(`/group/${(res as any).id}`);
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

  const desktopLayout = (
    <Row>
      <S.Wrap>
        <S.Wrapper>
          <Typography.Title level={2}>NEW GROUP</Typography.Title>
          <S.Form id="desktop-form">
            <Input name="name" onChange={onChange} placeholder="name" />
            <Button type="primary" htmlType="submit" onClick={handleCreateGroup}>
              Create
            </Button>
          </S.Form>
        </S.Wrapper>
        <S.Wrapper>
          <Typography.Title level={2}>{t('presentation.create')}</Typography.Title>
          <BaseForm onFinish={handleCreatePresentation}>
            <BaseForm.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required!' }]}>
              <Input placeholder="name" />
            </BaseForm.Item>
            <BaseForm.Item>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </BaseForm.Item>
          </BaseForm>
        </S.Wrapper>
      </S.Wrap>
    </Row>
  );

  const mobileAndTabletLayout = (
    <Row gutter={[20, 24]}>
      <S.Wrapper>
        <Typography.Title level={2}>New Group</Typography.Title>
        <S.Form id="desktop-form">
          <Input name="name" onChange={onChange} placeholder="name" />
          <Button type="primary" htmlType="submit" onClick={handleCreateGroup}>
            Create
          </Button>
        </S.Form>
      </S.Wrapper>
      <S.Wrapper>
        <Typography.Title level={2}>{t('presentation.create')}</Typography.Title>
        <S.Form id="desktop-form">
          <Input name="name" onChange={onChange} placeholder="name" />
          <Button type="primary" htmlType="submit" onClick={handleCreateGroup}>
            Create
          </Button>
        </S.Form>
      </S.Wrapper>
    </Row>
  );

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      {isDesktop ? desktopLayout : mobileAndTabletLayout}
    </>
  );
};
