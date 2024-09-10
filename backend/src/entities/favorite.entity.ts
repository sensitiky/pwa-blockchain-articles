import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, (post) => post.favorites, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.favorites, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  comment: Comment;

  @Column()
  isFavorite: boolean;
}
