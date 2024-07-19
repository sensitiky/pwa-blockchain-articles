import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';
import { Favorite } from '../favorites/favorite.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario: string;

  @Column({ nullable: true })
  facebookId: string;
  
  @Column()
  email: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column()
  contrasena: string;

  @Column({ nullable: true })
  date?: Date;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  medium?: string;

  @Column({ nullable: true })
  instagram?: string;

  @Column({ nullable: true })
  facebook?: string;

  @Column({ nullable: true })
  twitter?: string;

  @Column({ nullable: true })
  linkedin?: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];
  
  @Column({ nullable: true })
  bio?: string;
  
  @Column({ nullable: true })
  avatar?: string;
}
