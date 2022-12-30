import { CrownOutlined, GroupOutlined, SettingOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import {
  getGroup,
  inviteUsersToGroup,
  removeUserFromGroup,
  setCoOwner,
  setMember,
  toggleOpenForJoin,
} from '@app/api/group.api';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { MemberItem } from '@app/components/groups/components/MemberItem';
import { InviteMemberModal } from '@app/components/groups/InviteMemberModal';
import { GroupPresentation } from '@app/components/presentations/GroupPresentation/GroupPresentation';
import { notificationController } from '@app/controllers/notificationController';
import { GroupModel } from '@app/domain/GroupModel';
import { UserModel } from '@app/domain/UserModel';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useResponsive } from '@app/hooks/useResponsive';
import { Button, Row, Switch, Typography, Modal, Select, Tooltip } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import * as S from './GroupPage.styles';

export const GroupPage = ({ socket }: { socket: Socket }) => {
  const { isDesktop } = useResponsive();

  const params = useParams();
  const [group, setGroup] = useState<GroupModel | null>(null);

  const user = useAppSelector((state) => state.user.user);
  const [showSettings, setShowSettings] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      getGroup(params.id)
        .then((data) => {
          setGroup(data);
          setIsOwner(data.owner.id === user?.id);
        })
        .catch((err) => {
          notificationController.error({ message: "You can't access this group." });
          console.log(err);
        });
    } else {
      notificationController.error({ message: 'Missing group id' });
    }
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

  const showModal = () => {
    setModalOpen(true);
  };

  const handleOk = (selectdUsers: string[]) => {
    if (group && selectdUsers.length !== 0) {
      inviteUsersToGroup(selectdUsers, group.id)
        .then((data) => {
          console.log(data);
          notificationController.success({ message: 'Invitation sended' });
        })
        .catch((err) => {
          console.log(err);
          notificationController.error({ message: err.message });
        });
    }

    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleRemoveUser = (user: UserModel) => {
    if (group) {
      removeUserFromGroup(group.id || '', user.id.toString())
        .then((userRes) => {
          setGroup({
            ...group,
            coOwner: group.coOwner.filter((user) => user.id != userRes.id),
            members: group.members.filter((user) => user.id != userRes.id),
          });
          notificationController.success({ message: 'User removed' });
        })
        .catch((err) => {
          notificationController.error({ message: err.message });
        });
    }
  };

  const handleChangeToCoOwner = (user: UserModel) => {
    if (group) {
      setCoOwner(user, group).then(() => {
        setGroup({
          ...group,
          coOwner: [...group.coOwner, user],
          members: group.members.filter((user) => user.id != user.id),
        });
        notificationController.success({ message: 'User changed to co-owner' });
      });
    }
  };
  const handleChangeToMember = (user: UserModel) => {
    if (group) {
      setMember(user, group).then(() => {
        setGroup({
          ...group,
          members: [...group.members, user],
          coOwner: group.coOwner.filter((user) => user.id != user.id),
        });
        notificationController.success({ message: 'User changed to member' });
      });
    }
  };

  const desktopLayout = (
    <S.Wrapper>
      {group && group.presentation && group.presentation.isShowInGroup ? (
        <GroupPresentation socket={socket} code={group.presentation.code} />
      ) : (
        <Typography>No presentation</Typography>
      )}
      <S.FloatButton>
        <Button
          shape="circle"
          icon={<SettingOutlined />}
          onClick={() => {
            setShowSettings(true);
          }}
        />
      </S.FloatButton>
      <Modal
        visible={showSettings}
        onCancel={() => {
          setShowSettings(false);
        }}
        onOk={() => {
          setShowSettings(false);
        }}
      >
        <Row>
          <S.Wrapper>
            {group ? (
              <S.Wrapper>
                <Typography.Title level={2}>GROUP INFO</Typography.Title>
                <span>{group?.name}</span>
                <div>
                  <CrownOutlined style={{ color: 'yellow' }} />
                  <span>{group.owner.firstName + ' ' + group.owner.lastName}</span>
                </div>
                {isOwner ? (
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
                    {group.openForJoin ? (
                      <S.SectionContent>
                        <h3>Invite link</h3>
                        <S.LinkWrapper>
                          {group.inviteCode ? `${window.location.origin}/join/${group.inviteCode}` : 'No invite link'}
                        </S.LinkWrapper>
                      </S.SectionContent>
                    ) : null}
                    <S.SectionContent>
                      <Button size="small" icon={<UsergroupAddOutlined />} onClick={showModal}>
                        Invite member
                      </Button>
                    </S.SectionContent>
                  </S.Section>
                ) : null}

                {group.coOwner.length > 0 ? (
                  <>
                    <h1>Co-Owner</h1>
                    {group.coOwner.map((u) => {
                      return (
                        <MemberItem
                          key={u.id}
                          member={u}
                          showAction={isOwner}
                          changeRole={handleChangeToMember}
                          removeUser={handleRemoveUser}
                        />
                      );
                    })}
                  </>
                ) : (
                  <h1>No Co-Owner</h1>
                )}
                {group.members.length > 0 ? (
                  <>
                    <h1>Members</h1>
                    {group.members.map((u) => {
                      return (
                        <MemberItem
                          key={u.id}
                          member={u}
                          showAction={isOwner}
                          changeRole={handleChangeToCoOwner}
                          removeUser={handleRemoveUser}
                        />
                      );
                    })}
                  </>
                ) : (
                  <h1>No members</h1>
                )}
              </S.Wrapper>
            ) : null}
          </S.Wrapper>
          <InviteMemberModal
            visible={modalOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            memberList={[...(group?.coOwner || []), ...(group?.members || [])]}
          />
        </Row>
      </Modal>
    </S.Wrapper>
  );

  return (
    <>
      <PageTitle>Group</PageTitle>
      {desktopLayout}
    </>
  );
};
