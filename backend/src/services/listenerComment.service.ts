import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Post } from '../entities/post.entity';

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
    const postId = event.entity?.post?.id;

    if (!postId) {
      console.warn('Comment removed but related post ID is not available.');
      return;
    }

    const postRepository = event.manager.getRepository(Post);
    const post = await postRepository.findOne({
      where: { id: postId },
    });

    if (post) {
      post.commentscount -= 1;
      await postRepository.save(post);
    } else {
      console.warn(`Post with ID ${postId} not found.`);
    }
  }
}
