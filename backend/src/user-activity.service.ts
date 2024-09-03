import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './auth/users/user.entity';
import { IUserActivityService } from './auth/user-activity.interface';

@Injectable()
export class UserActivityService implements IUserActivityService {
  private activeUsers = new Set<number>();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updateLastActivity(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.lastActivity = new Date();
      await this.userRepository.save(user);
      this.activeUsers.add(userId);
    }
  }

  removeActiveUser(userId: number): void {
    this.activeUsers.delete(userId);
  }

  getActiveUsersCount(): number {
    return this.activeUsers.size;
  }
}
