import { CrownOutlined } from '@ant-design/icons';
import { toggleOpenForJoin } from '@app/api/group.api';
import { Button } from '@app/components/common/buttons/Button/Button.styles';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { MemberItem } from '@app/components/groups/components/MemberItem';
import { GroupModel } from '@app/domain/GroupModel';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useResponsive } from '@app/hooks/useResponsive';
import { readToken } from '@app/services/localStorage.service';
import { Row, Switch, Typography } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as S from './GroupPage.styles';

export const GroupPage = () => {
  const { isDesktop } = useResponsive();

  const params = useParams();
  const [group, setGroup] = useState<GroupModel | null>(null);

  const user = useAppSelector((state) => state.user.user);

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

  const handleSwitchChange = () => {
    toggleOpenForJoin(group?.id || '').then(() => {
      setGroup((prev) => {
        if (prev) {
          return {
            ...prev,
            openForJoin: !prev.openForJoin,
          };
        }
        return null;
      });
    });
  };

  const desktopLayout = (
    <Row>
      <S.LeftSideCol xl={16} xxl={17} id="desktop-content"></S.LeftSideCol>
      <S.RightSideCol xl={8} xxl={7}>
        {group ? (
          <S.Wrapper>
            <Typography.Title level={2}>GROUP INFO</Typography.Title>
            <div>
              <CrownOutlined style={{ color: 'yellow' }} />
              <span>{group.owner.firstName + ' ' + group.owner.lastName}</span>
            </div>
            {user?.id === group.owner.id ? (
              <S.Section>
                <S.SectionContent>
                  <h3>Open to join</h3>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    checked={group.openForJoin}
                    onChange={handleSwitchChange}
                  />
                </S.SectionContent>
                <S.SectionContent>
                  <Button>Add member</Button>
                </S.SectionContent>
              </S.Section>
            ) : null}

            {group.coOwner.length > 0 ? (
              <>
                <h1>Co-Owner</h1>
                {group.coOwner.map((u) => {
                  return <MemberItem key={u.id} member={u} />;
                })}
              </>
            ) : (
              <h1>No Co-Owner</h1>
            )}
            {group.members.length > 0 ? (
              <>
                <h1>Members</h1>
                {group.members.map((u) => {
                  return <MemberItem key={u.id} member={u} />;
                })}
              </>
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
