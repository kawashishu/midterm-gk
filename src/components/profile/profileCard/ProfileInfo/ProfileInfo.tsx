import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Row } from 'antd';
import { UserModel } from '@app/domain/UserModel';
import * as S from './ProfileInfo.styles';
import axios from 'axios';
import { updateImg } from '@app/store/slices/userSlice';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { notificationController } from '@app/controllers/notificationController';

interface ProfileInfoProps {
  profileData: UserModel | null;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ profileData }) => {
  const [fullness] = useState(90);
  const [avatar, setAvatar] = useState(profileData?.imgUrl);
  const [currentfile, setCurrentFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleUploadAvatar = () => {
    const formData = new FormData();
    formData.append('image', currentfile as File);
    axios.post('https://api.imgbb.com/1/upload?key=9304eb5630f3f1e2a368fa2ee7cf100f', formData).then((res) => {
      dispatch(updateImg(res.data.data.url))
        .unwrap()
        .then(() => {
          notificationController.success({ message: 'Change avatar successfull' });
        })
        .catch((err) => {
          notificationController.error({ message: err.message });
        });
    });
  };

  return profileData ? (
    <S.Wrapper>
      <S.ImgWrapper>
        <Avatar shape="circle" src={avatar} alt="Profile" />
      </S.ImgWrapper>
      <S.Wrapper>
        <Row justify="space-between">
          <S.AvatarLabel htmlFor="avatar">{currentfile ? currentfile.name : 'No file choosen'}</S.AvatarLabel>
          <input
            type="file"
            id="avatar"
            name="avatar"
            onChange={(e) => {
              console.log(e.target.files);
              if (e.target.files) {
                setAvatar(URL.createObjectURL(e.target.files[0]));
                setCurrentFile(e.target.files[0]);
              }
            }}
            hidden
          />
          <button onClick={handleUploadAvatar}>Save</button>
        </Row>
      </S.Wrapper>
      <S.Title>{`${profileData?.firstName} ${profileData?.lastName}`}</S.Title>
      <S.FullnessWrapper>
        <S.FullnessLine width={fullness}>{fullness}%</S.FullnessLine>
      </S.FullnessWrapper>
      <S.Text>{t('profile.fullness')}</S.Text>
    </S.Wrapper>
  ) : null;
};
