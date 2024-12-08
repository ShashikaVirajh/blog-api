import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-option.entity';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async createMetaOption(
    createPostMetaOptionsDto: CreatePostMetaOptionsDto,
  ) {
    const newMetaOption = this.metaOptionsRepository.create(
      createPostMetaOptionsDto,
    );

    await this.metaOptionsRepository.save(newMetaOption);
    return newMetaOption;
  }
}
