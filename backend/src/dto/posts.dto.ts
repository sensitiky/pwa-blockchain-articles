import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  imageUrl?: string;

  @IsNotEmpty()
  authorId: number;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}