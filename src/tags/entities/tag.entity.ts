import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: '#007bff' })
  color: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}