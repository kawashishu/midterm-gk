import { PlusCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import { addMultiCollaborators, getCollaborators, removeCollaborator } from '@app/api/presentation.api';
import { searchUsers } from '@app/api/user.api';
import { UserModel } from '@app/domain/UserModel';
import useDebounce from '@app/hooks/useDebounce';
import { Button, Divider, Modal, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';

interface CollaboratorModalProps {
  visible: boolean;
  presentationId: string;
  onOk: () => void;
  onCancel: () => void;
}

export const CollaboratorModal = ({ visible, presentationId, onOk, onCancel }: CollaboratorModalProps) => {
  const [listUsers, setListUsers] = useState<UserModel[]>([]);
  const [selectdUsers, setSelectedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [collaborators, setCollaborators] = useState<UserModel[]>([]);

  const debounceSearch = useDebounce(search, 700);

  useEffect(() => {
    getCollaborators(presentationId)
      .then((users) => setCollaborators(users))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    searchUsers(search).then((users) => setListUsers(users));
  }, [debounceSearch]);

  useEffect(() => {
    if (!visible) {
      setListUsers([]);
      setSearch('');
      setSelectedUsers([]);
    }
  }, [visible]);

  return (
    <Modal
      title="Add collaborators"
      visible={visible}
      onOk={() => {
        onOk();
      }}
      onCancel={onCancel}
    >
      <Select
        mode="multiple"
        placeholder="Select collaborators"
        suffixIcon={
          <PlusCircleOutlined
            sizes="large"
            color={'white'}
            onClick={() => {
              addMultiCollaborators(presentationId, selectdUsers)
                .then((value) => {
                  setSelectedUsers([]);
                  setCollaborators(value);
                })
                .catch((err) => console.log(err));
            }}
          />
        }
        showArrow={true}
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
        value={selectdUsers}
      >
        {listUsers.map((user) => (
          <Select.Option key={user.id} value={user.id} disabled={includesMember(collaborators, user)}>
            {user.email}
            {collaborators.includes(user)}
          </Select.Option>
        ))}
      </Select>
      <Divider />
      {collaborators.length > 0 ? (
        collaborators.map((user) => (
          <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
            {user.email}
            <Button
              danger
              onClick={() => {
                removeCollaborator(presentationId, user.id)
                  .then((value) => setCollaborators(value))
                  .catch((err) => console.log(err));
              }}
              size="small"
            >
              Remove
            </Button>
          </div>
        ))
      ) : (
        <Typography.Text>No collaborators</Typography.Text>
      )}
    </Modal>
  );
};

const includesMember = (memberList: UserModel[], user: UserModel) => {
  const userExist = memberList.filter((u) => u.id === user.id);
  return userExist.length > 0;
};
