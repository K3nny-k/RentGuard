import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({
    example: 'Ahmad bin Abdullah',
    description: 'Full name of the tenant',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'hash_123456789012',
    description: 'Hashed national ID for privacy (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  nationalIdHash?: string;
} 