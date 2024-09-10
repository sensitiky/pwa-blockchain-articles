import { Module } from '@nestjs/common';
import { MetricService } from '../services/metric.service';
import { MetricsController } from '../controllers/metric.controller';
import { UsersModule } from './user.module';
import { PostsModule } from './posts.module';
import { FavoritesModule } from './favorites.module';
import { UserActivityService } from '../services/user-activity.service';

@Module({
  imports: [UsersModule, PostsModule, FavoritesModule],
  controllers: [MetricsController],
  providers: [MetricService, UserActivityService],
})
export class MetricModule {}
