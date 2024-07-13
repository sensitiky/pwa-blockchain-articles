import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.databaseService.findUserByEmail(email);
    if (user && await bcrypt.compare(password, user.contrasena))
    return null;
  }
}
