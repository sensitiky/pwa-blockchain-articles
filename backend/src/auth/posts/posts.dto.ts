import { IsNotEmpty, IsOptional, IsBoolean, IsArray, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TagDto } from '../tag/tag.dto';

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
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  tags: TagDto[];
}
