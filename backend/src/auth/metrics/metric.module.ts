import { Module } from '@nestjs/common';
import { MetricService } from './metric.service';
import { MetricsController } from './metric.controller';
import { UsersModule } from '../users/user.module';
import { PostsModule } from '../posts/posts.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [UsersModule, PostsModule, FavoritesModule],
  controllers: [MetricsController],
  providers: [MetricService],
})
export class MetricModule {}
