import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async countPostsByCategory(): Promise<{ categoryId: number, postCount: number }[]> {
    return this.categoriesRepository.query(`
      SELECT categoryId, COUNT(*) as postCount 
      FROM post 
      GROUP BY categoryId
    `);
  }
}
