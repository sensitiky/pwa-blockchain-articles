import { Module, OnModuleInit } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './modules/database.module';
import { AuthModule } from './modules/auth.module';
import { PostsModule } from './modules/posts.module';
import { Category } from './entities/category.entity';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { CommentsModule } from './modules/comments.module';
import { FavoritesModule } from './modules/favorites.module';
import { CategoriesModule } from './modules/category.module';
import { TagsModule } from './modules/tag.module';
import { UsersModule } from './modules/user.module';
import { SearchModule } from './modules/search.module';
import { MetricModule } from './modules/metric.module';
import { UpdatePostCountsService } from './updatecount';
import { ActiveUsersGateway } from './active-users.gateway';
import { UserActivityService } from './services/user-activity.service';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule,
    PostsModule,
    UsersModule,
    CommentsModule,
    FavoritesModule,
    CategoriesModule,
    TagsModule,
    SearchModule,
    TypeOrmModule.forFeature([Category, Tag, User]),
    MetricModule,
  ],
  providers: [UpdatePostCountsService, ActiveUsersGateway, UserActivityService],
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
