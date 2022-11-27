import { UserOutlined } from '@ant-design/icons';
import { UserModel } from '@app/domain/UserModel';
import * as S from './style';

export const MemberItem = ({ member }: { member: UserModel }) => {
  return (
    <S.Item>
      <S.Icon>
        <UserOutlined />
      </S.Icon>
      <span>{member.firstName + ' ' + member.lastName}</span>
    </S.Item>
  );
};
