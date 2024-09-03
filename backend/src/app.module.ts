import { Module, OnModuleInit } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './auth/posts/posts.module';
import { Category } from './auth/category/category.entity';
import { Tag } from './auth/tag/tag.entity';
import { Repository } from 'typeorm';
import { CommentsModule } from './auth/comments/comments.module';
import { FavoritesModule } from './auth/favorites/favorites.module';
import { CategoriesModule } from './auth/category/category.module';
import { TagsModule } from './auth/tag/tag.module';
import { UsersModule } from './auth/users/user.module';
import { SearchModule } from './auth/search/search.module';
import { MetricModule } from './auth/metrics/metric.module';
import { UpdatePostCountsService } from './updatecount';
import { UserManagementModule } from './user-management.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UserManagementModule,
    AuthModule,
    PostsModule,
    UsersModule,
    CommentsModule,
    FavoritesModule,
    CategoriesModule,
    TagsModule,
    SearchModule,
    TypeOrmModule.forFeature([Category, Tag]),
    MetricModule,
  ],
  providers: [UpdatePostCountsService],
})
export class AppModule implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly updatePostCountsService: UpdatePostCountsService,
  ) {}

  async onModuleInit() {
    const predefinedCategories = [
      'Analysis & Opinions',
      'Tutorial',
      'Review',
      'Case Study',
      'News & Updates',
      'Resources & Tools',
      'Interviews',
    ];

    const predefinedTags = [
      'Bitcoin',
      'Ethereum',
      'Cardano',
      'DAOs',
      'Smart-Contracts',
      'Binance',
      'NFTs',
      'DeFi',
      'Metaverse',
      'Tokens',
      'CEX',
      'DEX',
      'Interoperability',
      'Scalability',
      'Decentralization',
      'Staking',
      'Mining',
      'Mints',
      'Governance',
      'PoW',
      'PoS',
      'CBDC',
      'IDO',
      'ICO',
      'ISPO',
    ];

    for (const name of predefinedCategories) {
      const category = await this.categoryRepository.findOne({
        where: { name },
      });
      if (!category) {
        await this.categoryRepository.save(
          this.categoryRepository.create({ name }),
        );
      }
    }

    for (const name of predefinedTags) {
      const tag = await this.tagRepository.findOne({ where: { name } });
      if (!tag) {
        await this.tagRepository.save(this.tagRepository.create({ name }));
      }
    }
    await this.updatePostCountsService.updateCounts();
  }
}
