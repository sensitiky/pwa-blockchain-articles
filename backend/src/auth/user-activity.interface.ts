export interface IUserActivityService {
  updateLastActivity(userId: number): Promise<void>;
  removeActiveUser(userId: number): void;
  getActiveUsersCount(): number;
}
