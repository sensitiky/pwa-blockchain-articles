import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from '../services/category.service';
import { Category } from '../entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get('count')
  countPostsByCategory() {
    return this.categoriesService.countPostsByCategory();
  }
}
