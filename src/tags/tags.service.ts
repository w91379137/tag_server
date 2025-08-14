import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagsRepository.create(createTagDto);
    return this.tagsRepository.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return this.tagsRepository.find({
      relations: ['posts'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagsRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);
    Object.assign(tag, updateTagDto);
    return this.tagsRepository.save(tag);
  }

  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagsRepository.remove(tag);
  }

  async search(query: string): Promise<Tag[]> {
    return this.tagsRepository.find({
      where: { name: Like(`%${query}%`) },
      relations: ['posts'],
      order: { name: 'ASC' },
    });
  }

  async getPopularTags(limit: number = 10): Promise<Tag[]> {
    return this.tagsRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.posts', 'post')
      .addSelect('COUNT(post.id)', 'postCount')
      .groupBy('tag.id')
      .orderBy('postCount', 'DESC')
      .limit(limit)
      .getMany();
  }
}