import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-option.entity';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';
import { DatabaseTimeoutException } from '../../helpers/exceptions';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  // Create meta-option
  public async create(createPostMetaOptionsDto: CreatePostMetaOptionsDto) {
    try {
      const newMetaOption = this.metaOptionsRepository.create(
        createPostMetaOptionsDto,
      );

      await this.metaOptionsRepository.save(newMetaOption);
      return newMetaOption;
    } catch (error) {
      DatabaseTimeoutException();
    }
  }
}
