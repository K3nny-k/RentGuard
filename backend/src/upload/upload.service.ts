import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME', 'rentguard-images');
    
    // Use internal docker hostname for MinIO client connection
    const internalEndpoint = this.configService.get('MINIO_ENDPOINT', 'minio:9000');
    
    this.minioClient = new Minio.Client({
      endPoint: internalEndpoint.split(':')[0],
      port: parseInt(internalEndpoint.split(':')[1] || '9000'),
      useSSL: this.configService.get('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.configService.get('MINIO_ROOT_USER', 'minioadmin'),
      secretKey: this.configService.get('MINIO_ROOT_PASSWORD', 'minioadmin'),
    });

    this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        console.log(`✅ Created MinIO bucket: ${this.bucketName}`);
      }
    } catch (error) {
      console.error('❌ Error creating MinIO bucket:', error);
    }
  }

  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    const uploadPromises = files.map(async (file) => {
      // Validate file type
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(`Invalid file type: ${file.mimetype}. Allowed types: ${allowedMimeTypes.join(', ')}`);
      }

      // Validate file size
      if (file.size > maxFileSize) {
        throw new BadRequestException(`File too large: ${file.size} bytes. Maximum size: ${maxFileSize} bytes`);
      }

      // Generate unique filename
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      try {
        // Upload to MinIO
        await this.minioClient.putObject(
          this.bucketName,
          fileName,
          file.buffer,
          file.size,
          {
            'Content-Type': file.mimetype,
          }
        );

        // Return the public URL (browser-accessible)
        // Use public endpoint for browser access, fallback to localhost for development
        const publicEndpoint = this.configService.get('MINIO_PUBLIC_ENDPOINT', 'localhost:9000');
        const useSSL = this.configService.get('MINIO_USE_SSL', 'false') === 'true';
        const protocol = useSSL ? 'https' : 'http';
        
        return `${protocol}://${publicEndpoint}/${this.bucketName}/${fileName}`;
      } catch (error) {
        console.error('Error uploading file to MinIO:', error);
        throw new BadRequestException(`Failed to upload file: ${file.originalname}`);
      }
    });

    return Promise.all(uploadPromises);
  }
} 