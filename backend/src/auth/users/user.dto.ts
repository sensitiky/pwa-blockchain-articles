export class CreateUserDto {
  nombre: string;
  user: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  code: string;
  facebookId?: string;
  avatar?: string;
  postCount?: number;
}

export class UserDto {
  id: number;
  user: string;
  facebookId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  date?: Date;
  country?: string;
  medium?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  bio?: string;
  avatar?: string;
  postCount: number;
}

export class UpdateUserDto {
   firstName?: string;
   lastName?: string;
   email?: string;
   user?: string;
   bio?: string;
   avatar?: string;
}
