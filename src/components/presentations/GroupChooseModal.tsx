import { showPresentationInGroup } from '@app/api/presentation.api';
import { GroupModel } from '@app/domain/GroupModel';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Button, Checkbox, Modal, Radio, Space } from 'antd';
import { useEffect, useState } from 'react';

export interface GroupChooseModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  presentationId: string;
}

export const GroupChooseModal = ({ visible, onOk, onCancel, presentationId }: GroupChooseModalProps) => {
  const { groups } = useAppSelector((state) => state.groups);

  const [checkedGroup, setCheckedGroup] = useState<GroupModel[]>([]);

  useEffect(() => {
    console.log(
      [...groups.myGroups, ...groups.joinGroups].filter(
        (group) => group.presentation && group.presentation.toString() === presentationId,
      ),
    );
    setCheckedGroup(
      [...groups.myGroups, ...groups.joinGroups].filter(
        (group) => group.presentation && group.presentation.toString() === presentationId,
      ),
    );
  }, [groups]);

  const onChange = (checkedValues: any) => {
    setCheckedGroup([...groups.myGroups, ...groups.joinGroups].filter((group) => checkedValues.includes(group.id)));
  };
  return (
    <Modal
      title="Choose group to present"
      visible={visible}
      onOk={() => {
        checkedGroup.forEach((group) => {
          showPresentationInGroup(presentationId, group.id);
        });
        onOk();
      }}
      onCancel={onCancel}
    >
      <Checkbox.Group
        options={[...groups.myGroups, ...groups.joinGroups].map((group) => {
          return {
            label: group.name,
            value: group.id,
          };
        })}
        value={checkedGroup.map((group) => group.id)}
        onChange={onChange}
      />
    </Modal>
  );
};
