import { Body, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { UsersService } from '../../users/providers/users.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly userService: UsersService,
    // Inject Post repository
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    // Inject MetaOption repository
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async create(@Body() createPostDto: CreatePostDto) {
    const author = await this.userService.findOneById(createPostDto.authorId);

    const newPost = this.postsRepository.create({
      ...createPostDto,
      author: author,
    });

    return await this.postsRepository.save(newPost);
  }

  public async findAll() {
    return await this.postsRepository.find({
      // Set 'eager:true' in the entity or specify related entities here
      relations: {
        metaOptions: true,
        author: true,
      },
    });
  }

  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return {
      deleted: true,
      id,
    };
  }
}
