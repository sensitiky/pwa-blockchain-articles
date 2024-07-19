export class CreateUserDto {
  nombre: string;
  usuario: string;
  email: string;
  contrasena: string;
  firstName?: string;
  lastName?: string;
  code: string;
  facebookId?: string;
  avatar?: string;
}

export class UpdateUserDto {
   firstName?: string;
   lastName?: string;
   email?: string;
   usuario?: string;
   bio?: string;
   avatar?: string;
}
