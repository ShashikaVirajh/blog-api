import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostsDto } from './dtos/get-post.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /** Get all posts */
  @Get('/:userId?')
  public getPosts(
    @Param('userId') userId: string,
    @Query() postQuery: GetPostsDto,
  ) {
    return this.postsService.findAll(postQuery);
  }

  /** Create new post */
  @ApiOperation({
    summary: 'Creates a new blog post',
  })
  @ApiResponse({
    status: 201,
    description:
      'You get a 201 data-response if your post is created successfully',
  })
  @Post()
  public createPost(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.postsService.create(createPostDto, user);
  }

  /** Update a post */
  @ApiOperation({
    summary: 'Updates an existing blog post',
  })
  @ApiResponse({
    status: 200,
    description: 'A 200 data-response if the post is updated successfully',
  })
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDto) {
    return this.postsService.update(patchPostDto);
  }

  /** Delete a post */
  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
