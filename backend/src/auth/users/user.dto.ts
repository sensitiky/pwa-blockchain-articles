export class CreateUserDto {
  nombre: string;
  usuario: string;
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
  usuario: string;
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
   usuario?: string;
   bio?: string;
   avatar?: string;
}
