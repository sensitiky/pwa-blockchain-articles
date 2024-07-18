import { IsNotEmpty, IsOptional, IsBoolean, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  imageUrl?: string;

  @IsNotEmpty()
  authorId: number;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsNotEmpty()
  categoryId: number;
  
  @IsArray()
  @ArrayNotEmpty()
  tags: string[];
}
