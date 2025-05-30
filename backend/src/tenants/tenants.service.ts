import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { nationalIdHash: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    return this.prisma.tenant.findMany({
      where,
      include: {
        ratings: {
          include: {
            landlord: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        ratings: {
          include: {
            landlord: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async create(createTenantDto: CreateTenantDto) {
    // Check if tenant with same national ID hash already exists
    if (createTenantDto.nationalIdHash) {
      const existingTenant = await this.prisma.tenant.findUnique({
        where: { nationalIdHash: createTenantDto.nationalIdHash },
      });

      if (existingTenant) {
        throw new ConflictException('Tenant with this national ID already exists');
      }
    }

    return this.prisma.tenant.create({
      data: createTenantDto,
      include: {
        ratings: true,
      },
    });
  }

  async rateTenant(tenantId: number, landlordId: number, createRatingDto: CreateRatingDto) {
    // Check if tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Check if landlord has already rated this tenant
    const existingRating = await this.prisma.rating.findUnique({
      where: {
        tenantId_landlordId: {
          tenantId,
          landlordId,
        },
      },
    });

    if (existingRating) {
      throw new ConflictException('You have already rated this tenant');
    }

    // Validate score range
    if (createRatingDto.score < 1 || createRatingDto.score > 5) {
      throw new ConflictException('Rating score must be between 1 and 5');
    }

    return this.prisma.rating.create({
      data: {
        ...createRatingDto,
        tenantId,
        landlordId,
      },
      include: {
        tenant: true,
        landlord: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }
} 