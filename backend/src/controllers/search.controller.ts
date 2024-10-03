import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchService } from '../services/search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') query: string, @Query('type') type: string = 'all') {
    if (!query) {
      return { message: 'Query parameter "q" is required.' };
    }
    const normalizedQuery = query.toLowerCase();
    const results = await this.searchService.search(normalizedQuery, type);
    return results;
  }

  @Get(':id')
  async searchById(@Param('id') id: string) {
    if (!id) {
      return { message: 'ID parameter is required.' };
    }
    const result = await this.searchService.searchById(id);
    if (!result) {
      return { message: 'No result found for the given ID.' };
    }
    return result;
  }
}
