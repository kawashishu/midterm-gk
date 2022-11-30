import { createGroup, getGroups } from '@app/api/group.api';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { notificationController } from '@app/controllers/notificationController';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { useResponsive } from '@app/hooks/useResponsive';
import { readToken } from '@app/services/localStorage.service';
import { setGroups } from '@app/store/slices/groupSlice';
import { Button, Input, Row, Typography } from 'antd';
import React, { useState } from 'react';
import * as S from './DashboardPage.styles';

export const Dashboard = () => {
  const { isDesktop } = useResponsive();

  const [value, setValue] = useState('');
  const dispatch = useAppDispatch();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handleCreateGroup = (e: any) => {
    e.preventDefault();
    if (!value) {
      return;
    }
    console.log(readToken());
    createGroup(value)
      .then((res) => {
        getGroups().then((data) => {
          dispatch(setGroups(data));
        });
        notificationController.success({ message: 'Group created successfully' });
      })
      .catch((err) => {
        console.log(err);
        notificationController.error({ message: 'Group creation failed' });
      });

    console.log(value);
  };

  const desktopLayout = (
    <Row>
      <S.LeftSideCol xl={16} xxl={17} id="desktop-content">
        <S.Wrapper>
          <Typography.Title level={2}>NEW GROUP</Typography.Title>
          <S.Form id="desktop-form">
            <Input name="name" onChange={onChange} />
            <Button type="primary" htmlType="submit" onClick={handleCreateGroup}>
              Save
            </Button>
          </S.Form>
        </S.Wrapper>
      </S.LeftSideCol>
      <S.RightSideCol xl={8} xxl={7}></S.RightSideCol>
    </Row>
  );

  const mobileAndTabletLayout = <Row gutter={[20, 24]}></Row>;

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      {isDesktop ? desktopLayout : mobileAndTabletLayout}
    </>
  );
};
