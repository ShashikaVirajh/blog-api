import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { databaseTimeoutException } from '../../helpers/exceptions.helpers';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  // Create tag
  public async create(createTagDto: CreateTagDto) {
    try {
      const newTag = this.tagsRepository.create(createTagDto);
      return await this.tagsRepository.save(newTag);
    } catch (error) {
      databaseTimeoutException();
    }
  }

  // Find multiple tags by ids
  public async findMultiple(ids: number[]) {
    try {
      return await this.tagsRepository.find({ where: { id: In(ids) } });
    } catch (error) {
      databaseTimeoutException();
    }
  }

  // Delete a tag
  public async delete(id: number) {
    try {
      await this.tagsRepository.delete(id);

      return {
        deleted: true,
        id,
      };
    } catch (error) {
      databaseTimeoutException();
    }
  }

  // Soft-Delete a tag
  public async softDelete(id: number) {
    try {
      await this.tagsRepository.softDelete(id);

      return {
        softDeleted: true,
        id,
      };
    } catch (error) {
      databaseTimeoutException();
    }
  }
}
