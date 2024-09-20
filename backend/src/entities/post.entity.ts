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
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { Tag } from './tag.entity';
import { Favorite } from './favorite.entity';

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

  @Column({ type: 'int', nullable: true })
  readTime?: number;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ManyToOne(() => Category, (category) => category.posts)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable()
  tags: Tag[];

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @Column({ nullable: true })
  savedAt: Date;

  @Column({ type: 'bytea', nullable: true })
  imageUrl: Buffer;

  @OneToMany(() => Favorite, (favorite) => favorite.post)
  favorites: Favorite[];

  @Column({ type: 'int', default: 0 })
  commentscount: number;

  @Column({ type: 'int', default: 0 })
  favoritescount: number;

  imageUrlBase64: string;
}
