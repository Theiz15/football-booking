export class UserResponseDto {
  id!: string;
  fullName!: string;
  phone!: string;
  role!: string;
}

export class LoginResponseDataDto {
  accessToken!: string;
  user!: UserResponseDto;
}