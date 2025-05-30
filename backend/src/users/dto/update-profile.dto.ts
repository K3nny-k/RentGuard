import { IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'newemail@example.com',
    description: 'Updated email address',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;
} 