import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { SearchService } from '../services/search.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async search(
    @Query('q') query: string,
    @Query('type') type: string = 'all',
    @Req() request: Request,
  ) {
    if (!query) {
      return { message: 'Query parameter "q" is required.' };
    }

    const normalizedQuery = query.toLowerCase();
    const userID = request.user?.id;

    const results = await this.searchService.search(
      normalizedQuery,
      type,
      userID,
    );
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
