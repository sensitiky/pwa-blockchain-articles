import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Favorite } from '../auth/favorites/favorite.entity';
import { Post } from '../auth/posts/post.entity';
import { Comment } from '../auth/comments/comment.entity';

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

    if (event.entity.post) {
      const post = await postRepository.findOne({
        where: { id: event.entity.post.id },
      });
      if (post) {
        post.favoritescount -= 1;
        await postRepository.save(post);
      }
    }
  }
}
