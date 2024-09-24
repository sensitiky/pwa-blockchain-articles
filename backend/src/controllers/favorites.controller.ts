import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FavoritesService } from '../services/favorites.service';
import { CreateFavoriteDto } from '../dto/favorite.dto';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(createFavoriteDto);
  }

  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: number) {
    return this.favoritesService.findAllByUser(userId);
  }

  @Delete()
  remove(
    @Query('userId') userId: number,
    @Query('postId') postId?: number,
    @Query('commentId') commentId?: number,
  ) {
    return this.favoritesService.remove(userId, postId, commentId);
  }
}
