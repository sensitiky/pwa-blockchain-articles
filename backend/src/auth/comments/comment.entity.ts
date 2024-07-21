import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';
import { Favorite } from '../favorites/favorite.entity';

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

  @ManyToOne(() => Comment, comment => comment.replies, { nullable: true })
  parentComment: Comment;

  @OneToMany(() => Comment, comment => comment.parentComment)
  replies: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @OneToMany(() => Favorite, (favorite) => favorite.comment)
  favorites: Favorite[];
}
