import {
    Controller,
    Post,
    Body,
    Get,
    Param,
  } from '@nestjs/common';
  import { FavoritesService } from './favorites.service';
  import { CreateFavoriteDto } from '../../dto/favorite.dto';
  
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
  }
  