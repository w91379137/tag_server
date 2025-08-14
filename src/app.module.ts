import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { Post } from './posts/entities/post.entity';
import { Tag } from './tags/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'blog.db',
      entities: [Post, Tag],
      synchronize: true,
      logging: true,
    }),
    PostsModule,
    TagsModule,
  ],
})
export class AppModule {}