import { Body, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../../meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    // Inject Post repository
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    // Inject MetaOption repository
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async create(@Body() createPostDto: CreatePostDto) {
    const newPost = this.postsRepository.create(createPostDto);
    return await this.postsRepository.save(newPost);
  }

  public async findAll() {
    return await this.postsRepository.find();
  }

  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return {
      deleted: true,
      id,
    };
  }
}
