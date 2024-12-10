import { Body, Injectable } from '@nestjs/common';
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
    const post = await this.postsRepository.findOneBy({ id: patchPostDto.id });

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
