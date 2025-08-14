import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Tag } from '../tags/entities/tag.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { tagNames, ...postData } = createPostDto;
    
    const post = this.postsRepository.create(postData);
    
    if (tagNames && tagNames.length > 0) {
      const tags = await this.findOrCreateTags(tagNames);
      post.tags = tags;
    }
    
    return this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['tags'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['tags'],
    });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    const { tagNames, ...postData } = updatePostDto;
    
    Object.assign(post, postData);
    
    if (tagNames) {
      const tags = await this.findOrCreateTags(tagNames);
      post.tags = tags;
    }
    
    return this.postsRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postsRepository.remove(post);
  }

  async findByTags(tagNames: string[]): Promise<Post[]> {
    return this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .where('tag.name IN (:...tagNames)', { tagNames })
      .orderBy('post.createdAt', 'DESC')
      .getMany();
  }

  private async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    const existingTags = await this.tagsRepository.find({
      where: { name: In(tagNames) },
    });
    
    const existingTagNames = existingTags.map(tag => tag.name);
    const newTagNames = tagNames.filter(name => !existingTagNames.includes(name));
    
    const newTags = newTagNames.map(name => this.tagsRepository.create({ name }));
    const savedNewTags = await this.tagsRepository.save(newTags);
    
    return [...existingTags, ...savedNewTags];
  }
}