import { IsInt, IsString, IsOptional, Min, Max, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({
    example: 5,
    description: 'Rating score from 1 to 5',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;

  @ApiProperty({
    example: 'Excellent tenant! Always pays rent on time and keeps the property clean.',
    description: 'Optional comment about the tenant',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    example: 'https://example.com/proof/rating1.pdf',
    description: 'Optional URL to proof document (receipt, contract, etc.)',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  proofUrl?: string;
} 