import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';

@EventSubscriber()
export class FavoriteSubscriber implements EntitySubscriberInterface<Favorite> {
  listenTo() {
    return Favorite;
  }

  async afterInsert(event: InsertEvent<Favorite>) {
    const postRepository = event.manager.getRepository(Post);
    const commentRepository = event.manager.getRepository(Comment);

    if (event.entity.post) {
      const post = await postRepository.findOne({
        where: { id: event.entity.post.id },
      });
      if (post) {
        post.favoritescount += 1;
        await postRepository.save(post);
      }
    }
  }

  async afterRemove(event: RemoveEvent<Favorite>) {
    const postRepository = event.manager.getRepository(Post);
    const commentRepository = event.manager.getRepository(Comment);

    const favorite = await event.manager.getRepository(Favorite).findOne({
      where: { id: event.entityId },
      relations: ['post'],
    });

    if (favorite && favorite.post) {
      const post = await postRepository.findOne({
        where: { id: favorite.post.id },
      });
      if (post) {
        post.favoritescount -= 1;
        await postRepository.save(post);
      }
    } else {
      console.warn('Favorite removed but related post ID is not available.');
    }
  }
}
