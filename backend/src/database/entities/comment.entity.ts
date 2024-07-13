import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, user => user.comments)
  author: User;

  @ManyToOne(() => Post, post => post.comments)
  post: Post;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
