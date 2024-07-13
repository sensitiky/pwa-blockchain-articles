import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.favorites)
  user: User;

  @ManyToOne(() => Post, post => post.id)
  post: Post;

  @ManyToOne(() => Comment, comment => comment.id)
  comment: Comment;

  @Column()
  isFavorite: boolean;
}
