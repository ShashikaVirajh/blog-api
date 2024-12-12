import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { UsersService } from '../../users/providers/users.service';
import { TagsService } from '../../tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly tagsService: TagsService,
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
    const tagIds = await this.tagsService.findMultiple(createPostDto.tags);

    const newPost = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tagIds,
    });

    return await this.postsRepository.save(newPost);
  }

  public async update(patchPostDto: PatchPostDto) {
    let post = null;
    let tags = null;

    post = await this.postsRepository.findOneBy({ id: patchPostDto.id });

    try {
      tags = await this.tagsService.findMultiple(patchPostDto.tags);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    console.log('patchPostDto.tags.length', patchPostDto.tags.length);
    console.log('tags', tags);

    if (!tags || tags.length !== patchPostDto.tags.length) {
      throw new BadRequestException(
        'Please check your tag Ids and ensure they are correct',
      );
    }

    try {
      post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!post) {
      throw new BadRequestException('The post Id does not exist');
    }

    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    post.tags = await this.tagsService.findMultiple(patchPostDto.tags);

    return await this.postsRepository.save(post);
  }

  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return {
      deleted: true,
      id,
    };
  }

  public async findAll() {
    return await this.postsRepository.find({
      // Set 'eager:true' in the entity or specify related entities here
      relations: {
        metaOptions: true,
        author: true,
        tags: true,
      },
    });
  }
}
