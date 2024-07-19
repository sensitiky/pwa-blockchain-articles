export class CreateUserDto {
  nombre: string;
  usuario: string;
  email: string;
  contrasena: string;
  firstName?: string;
  lastName?: string;
  code: string;
  facebookId?: string;
}

export class UpdateUserDto {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly usuario?: string;
  readonly bio?: string;
}
