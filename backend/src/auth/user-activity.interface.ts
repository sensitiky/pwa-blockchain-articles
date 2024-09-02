export interface IUserActivityService {
  updateLastActivity(userId: number): Promise<void>;
}
