import { AnswerModal } from '@app/domain/PresentationModel';
import { Button, Modal, Table } from 'antd';

export interface AnswerModalModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  answers: AnswerModal[];
}

export const AnswersModal = ({ visible, onOk, onCancel, answers }: AnswerModalModalProps) => {
  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
    },
    {
      title: 'At',
      dataIndex: 'at',
      key: 'at',
      style: { textAlign: 'center', fontSize: '12px' },
    },
  ];
  return (
    <Modal title="Answers" visible={visible} onOk={onOk} footer={<Button onClick={onOk}>OK</Button>}>
      <Table
        dataSource={answers.map((a) => {
          return {
            user: a.user.email.split('@')[0],
            answer: a.answer,
            at: parseDate(a.createAt),
          };
        })}
        columns={columns}
      />
    </Modal>
  );
};

const parseDate = (dateData: string) => {
  const date = new Date(Date.parse(dateData));
  return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
