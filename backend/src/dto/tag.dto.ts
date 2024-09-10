import { IsOptional, IsString, IsUUID } from 'class-validator';

export class TagDto {
    @IsOptional()
    @IsUUID()
    id?: string;

    @IsString()
    name: string;
}
    