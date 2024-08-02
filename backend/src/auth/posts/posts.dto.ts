import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TagDto } from '../tag/tag.dto';
import { Column } from 'typeorm';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Column({ type: 'bytea', nullable: true })
  imageUrl?: Buffer;

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

export class updatePostDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Column({ type: 'bytea', nullable: true })
  imageUrl?: Buffer;

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