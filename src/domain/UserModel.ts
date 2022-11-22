export interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  imgUrl?: string;
  email: string;
  isEmailVerified: boolean;
}
