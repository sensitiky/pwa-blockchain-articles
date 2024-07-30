import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query('q') query: string,
    @Query('type') type: string = 'all'
  ) {
    if (!query) {
      return { message: 'Query parameter "q" is required.' };
    }

    const results = await this.searchService.search(query, type);
    return results;
  }
}
