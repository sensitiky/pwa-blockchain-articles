import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateFavoriteDto {
  @IsNotEmpty()
  userId: number;

  @IsOptional()
  postId?: number;

  @IsOptional()
  commentId?: number;

  @IsBoolean()
  @IsNotEmpty()
  isFavorite: boolean;
}
