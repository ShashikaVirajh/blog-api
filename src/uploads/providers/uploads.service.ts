import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import { fileTypes } from '../enums/file-types.enum';
import { Upload } from '../upload.entity';
import { SUPPORTED_FILE_TYPES } from '../constants/upload.constants';
import { UploadFile } from '../interfaces/upload-file.interface';
import { UploadToAwsProvider } from './upload-to-aws.provider';

@Injectable()
export class UploadsService {
  constructor(
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    private readonly configService: ConfigService,
    @InjectRepository(Upload)
    private uploadsRepository: Repository<Upload>,
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    if (!SUPPORTED_FILE_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('MIME type not supported');
    }

    try {
      const path = await this.uploadToAwsProvider.fileUpload(file);

      const fileToUpload: UploadFile = {
        name: path,
        path: `https://${this.configService.get<string>(
          'appConfig.awsCloudfrontUrl',
        )}/${path}`,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      const upload = this.uploadsRepository.create(fileToUpload);
      return await this.uploadsRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
