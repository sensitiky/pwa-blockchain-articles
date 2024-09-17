import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserActivityService } from '../auth/user-activity.interface';
import { MetricService } from './metric.service';

@Injectable()
export class UserActivityService implements IUserActivityService {
  private activeUsers = new Set<number>();
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => MetricService))
    private readonly metricService: MetricService,
  ) {}

  async updateLastActivity(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.lastActivity = new Date();
      await this.userRepository.save(user);
      this.activeUsers.add(userId);

      // Log the event with Mixpanel
      console.log('User Activity Updated', {
        distinct_id: userId,
        lastActivity: user.lastActivity,
      });

      // Track event with Mixpanel
      await this.metricService.trackEvent('User Activity Updated', {
        distinct_id: userId,
        lastActivity: user.lastActivity,
      });
    }
  }

  removeActiveUser(userId: number): void {
    this.activeUsers.delete(userId);
  }

  getActiveUsersCount(): number {
    return this.activeUsers.size;
  }
}
