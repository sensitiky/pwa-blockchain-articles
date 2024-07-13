import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Favorite } from './favorite.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario: string;

  @Column()
  email: string;

  @Column()
  contrasena: string;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @OneToMany(() => Favorite, favorite => favorite.user)
  favorites: Favorite[];
}
