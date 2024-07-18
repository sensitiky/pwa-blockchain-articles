import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.favorites)
  user: User;

  @ManyToOne(() => Post, post => post.favorites, { nullable: true })
  post: Post;

  @ManyToOne(() => Comment, comment => comment.favorites, { nullable: true })
  comment: Comment;

  @Column()
  isFavorite: boolean;
}
