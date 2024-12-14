import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { UsersService } from '../../users/providers/users.service';
import { TagsService } from '../../tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { databaseTimeoutException } from '../../helpers/exceptions';

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

  // Create post
  public async create(@Body() createPostDto: CreatePostDto) {
    try {
      const author = await this.userService.findOneById(createPostDto.authorId);
      const tagIds = await this.tagsService.findMultiple(createPostDto.tags);

      const newPost = this.postsRepository.create({
        ...createPostDto,
        author: author,
        tags: tagIds,
      });

      return await this.postsRepository.save(newPost);
    } catch (error) {
      databaseTimeoutException();
    }
  }

  public async update(patchPostDto: PatchPostDto) {
    try {
      const post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });

      if (!post) {
        throw new BadRequestException('The post Id does not exist');
      }

      const postTags = await this.tagsService.findMultiple(patchPostDto.tags);

      if (!postTags || postTags.length !== patchPostDto.tags.length) {
        throw new BadRequestException(
          'Please check your tag Ids and ensure they are correct',
        );
      }

      post.title = patchPostDto.title ?? post.title;
      post.content = patchPostDto.content ?? post.content;
      post.status = patchPostDto.status ?? post.status;
      post.postType = patchPostDto.postType ?? post.postType;
      post.slug = patchPostDto.slug ?? post.slug;
      post.featuredImageUrl =
        patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
      post.publishOn = patchPostDto.publishOn ?? post.publishOn;

      post.tags = postTags;

      return await this.postsRepository.save(post);
    } catch (error) {
      databaseTimeoutException();
    }
  }

  // Delete post
  public async delete(id: number) {
    try {
      await this.postsRepository.delete(id);

      return {
        deleted: true,
        id,
      };
    } catch (error) {
      databaseTimeoutException();
    }
  }

  // Find all posts
  public async findAll() {
    try {
      return await this.postsRepository.find({
        // Set 'eager:true' in the entity or specify related entities here
        relations: {
          metaOptions: true,
          author: true,
          tags: true,
        },
      });
    } catch (error) {
      databaseTimeoutException();
    }
  }
}
