import { exceptInvitation } from '@app/api/group.api';
import { Loading } from '@app/components/common/Loading';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { notificationController } from '@app/controllers/notificationController';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const InvitationPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.id) {
      exceptInvitation(params.id)
        .then((data) => {
          notificationController.success({ message: 'You have join the group' });
          navigate(`/group/${data.id}`);
        })
        .catch((err) => {
          notificationController.error({ message: err.message });
          navigate('/');
        });
    }
  });

  return (
    <>
      <PageTitle>Except Invitation</PageTitle>
      <Loading />
    </>
  );
};
