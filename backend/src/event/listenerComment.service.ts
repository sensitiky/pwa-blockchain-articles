import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';
import { Comment } from '../auth/comments/comment.entity';
import { Post } from '../auth/posts/post.entity';

@EventSubscriber()
export class CommentSubscriber implements EntitySubscriberInterface<Comment> {
  listenTo() {
    return Comment;
  }

  async afterInsert(event: InsertEvent<Comment>) {
    const postRepository = event.manager.getRepository(Post);
    const post = await postRepository.findOne({
      where: { id: event.entity.post.id },
    });
    if (post) {
      post.commentscount += 1;
      await postRepository.save(post);
    }
  }

  async afterRemove(event: RemoveEvent<Comment>) {
    const postRepository = event.manager.getRepository(Post);
    const post = await postRepository.findOne({
      where: { id: event.entity.post.id },
    });
    if (post) {
      post.commentscount -= 1;
      await postRepository.save(post);
    }
  }
}
