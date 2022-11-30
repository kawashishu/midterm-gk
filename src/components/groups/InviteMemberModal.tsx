import { searchUsers } from '@app/api/user.api';
import { UserModel } from '@app/domain/UserModel';
import useDebounce from '@app/hooks/useDebounce';
import { Modal, Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';

interface InviteMemberModalProps {
  visible: boolean;
  memberList: UserModel[];
  onOk: (listUserId: string[]) => void;
  onCancel: () => void;
  onUsersSelected: (users: UserModel[]) => void;
}

export const InviteMemberModal = ({ visible, memberList, onOk, onCancel, onUsersSelected }: InviteMemberModalProps) => {
  const [listUsers, setListUsers] = useState<UserModel[]>([]);
  const [selectdUsers, setSelectedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const debounceSearch = useDebounce(search, 700);

  useEffect(() => {
    searchUsers(search).then((users) => setListUsers(users));
  }, [debounceSearch]);

  useEffect(() => {
    if (!visible) {
      setListUsers([]);
      setSearch('');
    }
  }, [visible]);

  return (
    <Modal
      title="Invite member"
      visible={visible}
      onOk={() => {
        onOk(selectdUsers);
      }}
      onCancel={onCancel}
    >
      <Select
        mode="multiple"
        placeholder="Select members"
        style={{ width: '100%' }}
        onSearch={(value) => {
          setSearch(value);
        }}
        filterOption={(input, option) => {
          const email = option?.children ? option?.children[0].toString() : null;
          return email ? email.toLowerCase().includes(input.toLowerCase()) : false;
        }}
        onSelect={(value: string) => {
          setSelectedUsers([...selectdUsers, value]);
        }}
        onDeselect={(value: string) => {
          setSelectedUsers(selectdUsers.filter((su) => su !== value));
        }}
      >
        {listUsers.map((user) => (
          <Select.Option key={user.id} value={user.id} disabled={includesMember(memberList, user)}>
            {user.email}
            {memberList.includes(user)}
          </Select.Option>
        ))}
      </Select>
    </Modal>
  );
};

const includesMember = (memberList: UserModel[], user: UserModel) => {
  const userExist = memberList.filter((u) => u.id === user.id);
  return userExist.length > 0;
};
