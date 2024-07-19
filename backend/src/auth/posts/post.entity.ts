import {
  ManyToMany,
  JoinTable,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../category/category.entity';
import { Comment } from '../comments/comment.entity';
import { Tag } from '../../database/entities/tag.entity';
import { Favorite } from '../favorites/favorite.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  content: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @ManyToOne(() => Category, (category) => category.posts)
  category: Category;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Tag, (tag) => tag.posts, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @Column({ nullable: true })
  savedAt: Date;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => Favorite, (favorite) => favorite.post)
  favorites: Favorite[];
}
