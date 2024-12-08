import { Body, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../../meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    // Inject Users service
    private readonly usersService: UsersService,
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

  public async findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    return await this.postsRepository.find();
  }

  public async delete(id: number) {
    const post = await this.postsRepository.findOneBy({ id });
    const metaOptionId = post.metaOptions.id;

    await this.postsRepository.delete(id);
    await this.metaOptionsRepository.delete(metaOptionId);

    return {
      deleted: true,
      id,
    };
  }
}
