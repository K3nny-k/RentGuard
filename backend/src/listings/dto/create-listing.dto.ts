import { IsString, IsNumber, IsArray, IsOptional, MinLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateListingDto {
  @ApiProperty({
    example: 'Modern 2BR Apartment in KLCC',
    description: 'Title of the property listing',
  })
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({
    example: 2500.00,
    description: 'Monthly rent amount in MYR',
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  rent: number;

  @ApiProperty({
    example: 'Kuala Lumpur City Centre',
    description: 'Location of the property',
  })
  @IsString()
  @MinLength(3)
  location: string;

  @ApiProperty({
    example: ['https://example.com/images/apartment1_1.jpg', 'https://example.com/images/apartment1_2.jpg'],
    description: 'Array of image URLs for the property',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pictures?: string[];
} 