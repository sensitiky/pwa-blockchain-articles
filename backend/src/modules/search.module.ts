import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from '../services/search.service';
import { SearchController } from '../controllers/search.controller';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { PostsModule } from './posts.module';
import { UsersModule } from '../modules/user.module';
import { MetricModule } from './metric.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post]),
    forwardRef(() => PostsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => MetricModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '360m' },
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
