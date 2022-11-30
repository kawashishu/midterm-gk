import { DashOutlined, UsergroupDeleteOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { UserModel } from '@app/domain/UserModel';
import { Dropdown } from 'antd';
import * as S from './style';

export const MemberItem = ({
  member,
  showAction,
  removeUser,
  changeRole,
}: {
  member: UserModel;
  showAction?: boolean;
  removeUser?: (user: UserModel) => void;
  changeRole?: (user: UserModel) => void;
}) => {
  return (
    <S.Item>
      <S.Item>
        <S.Icon>
          <UserOutlined />
        </S.Icon>
        <span>{member.firstName + ' ' + member.lastName}</span>
      </S.Item>
      {showAction && (
        <Dropdown
          trigger={['click']}
          placement="bottom"
          overlay={
            <div>
              <S.MenuItem
                onClick={() => {
                  if (removeUser) {
                    removeUser(member);
                  }
                }}
              >
                <UsergroupDeleteOutlined /> remove
              </S.MenuItem>
              <S.MenuItem
                onClick={() => {
                  if (changeRole) {
                    changeRole(member);
                  }
                }}
              >
                <UserSwitchOutlined /> Change role
              </S.MenuItem>
            </div>
          }
        >
          <S.MenuButton style={{ cursor: 'pointer' }}>
            <DashOutlined size={12} cellPadding={0} />
          </S.MenuButton>
        </Dropdown>
      )}
    </S.Item>
  );
};
