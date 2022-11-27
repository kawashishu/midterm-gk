import { CrownOutlined } from '@ant-design/icons';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { MemberItem } from '@app/components/groups/components/MemberItem';
import { GroupModel } from '@app/domain/GroupModel';
import { useResponsive } from '@app/hooks/useResponsive';
import { readToken } from '@app/services/localStorage.service';
import UserSlice from '@app/store/slices/userSlice';
import { Row, Typography } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as S from './GroupPage.styles';

export const GroupPage = () => {
  const { isDesktop } = useResponsive();

  const params = useParams();
  const [group, setGroup] = useState<GroupModel | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/v1/groups/${params.id}`, {
        headers: {
          Authorization: `Bearer ${readToken()}`,
        },
      })
      .then((res) => {
        setGroup(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params]);

  const desktopLayout = (
    <Row>
      <S.LeftSideCol xl={16} xxl={17} id="desktop-content"></S.LeftSideCol>
      <S.RightSideCol xl={8} xxl={7}>
        {group ? (
          <S.Wrapper>
            <Typography.Title level={2}>GROUP INFO</Typography.Title>
            <div>
              <CrownOutlined />
              <span>{group.owner.firstName + ' ' + group.owner.lastName}</span>
            </div>

            {group.coOwner.length > 0 ? (
              group.coOwner.map((u) => {
                return <MemberItem member={u} />;
              })
            ) : (
              <h1>No CoOwner</h1>
            )}
            {group.members.length > 0 ? (
              group.members.map((u) => {
                return <MemberItem member={u} />;
              })
            ) : (
              <h1>No members</h1>
            )}
          </S.Wrapper>
        ) : null}
      </S.RightSideCol>
    </Row>
  );

  const mobileAndTabletLayout = <Row gutter={[20, 24]}></Row>;

  return (
    <>
      <PageTitle>Group</PageTitle>
      {isDesktop ? desktopLayout : mobileAndTabletLayout}
    </>
  );
};
