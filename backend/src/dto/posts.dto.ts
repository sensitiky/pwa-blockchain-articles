import { IsNotEmpty, IsOptional, IsBoolean, IsArray, ArrayNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsNotEmpty()
  categoryId: number;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
