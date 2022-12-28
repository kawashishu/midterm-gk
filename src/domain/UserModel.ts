export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  imgUrl?: string;
  email: string;
  isEmailVerified: boolean;
}
