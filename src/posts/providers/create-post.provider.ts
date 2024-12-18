import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    try {
      const author = await this.usersService.findOneById(user.sub);
      const tags = await this.tagsService.findMultiple(createPostDto.tags);

      if (createPostDto.tags.length !== tags.length) {
        throw new BadRequestException('Please check your tag Ids');
      }

      const post = this.postsRepository.create({
        ...createPostDto,
        author: author,
        tags: tags,
      });

      await this.postsRepository.save(post);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
