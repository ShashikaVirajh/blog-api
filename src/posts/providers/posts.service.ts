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
    // Create metaOptions if available in the request body
    let metaOptions = createPostDto.metaOptions
      ? this.metaOptionsRepository.create(createPostDto.metaOptions)
      : null;

    if (metaOptions) {
      await this.metaOptionsRepository.save(metaOptions);
    }

    // Create post
    const newPost = this.postsRepository.create(createPostDto);

    // Add metaOptions to the post
    if (metaOptions) {
      // Passing the entire metaOptions object. Not only the id.
      newPost.metaOptions = metaOptions;
    }

    return await this.postsRepository.save(newPost);
  }

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);

    return [
      {
        user,
        title: 'Post 1',
        content: 'Post 1 content',
      },
      {
        user,
        title: 'Post 2',
        content: 'Post 2 content',
      },
    ];
  }
}
