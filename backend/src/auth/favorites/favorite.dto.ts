export class CreateFavoriteDto {
    userId: number;
    postId?: number;
    commentId?: number;
    isFavorite: boolean;
  }