import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { UsersService } from '../../users/providers/users.service';
import { TagsService } from '../../tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { databaseTimeoutException } from '../../helpers/exceptions.helpers';
import { GetPostsDto } from '../dtos/get-post.dto';
import { PaginationService } from '../../common/pagination/providers/pagination.service';
import { PaginatedResponse } from '../../common/pagination/interfaces/paginated-response.interface';
import { ActiveUserData } from '../../auth/interfaces/active-user-data.interface';
import { CreatePostProvider } from './create-post.provider';

@Injectable()
export class PostsService {
  constructor(
    private readonly tagsService: TagsService,
    private readonly userService: UsersService,
    private readonly paginationService: PaginationService,
    private readonly createPostProvider: CreatePostProvider,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  // Create post
  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    return await this.createPostProvider.create(createPostDto, user);
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
  public async findAll(
    postQuery: GetPostsDto,
  ): Promise<PaginatedResponse<Post>> {
    try {
      const posts = await this.paginationService.paginateQuery(
        {
          limit: postQuery.limit,
          page: postQuery.page,
        },
        this.postsRepository,
      );

      return posts;
    } catch (error) {
      databaseTimeoutException();
    }
  }
}
