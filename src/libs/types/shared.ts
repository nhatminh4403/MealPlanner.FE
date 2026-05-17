export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

export interface PagedRequest {
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

export type DifficultyLevel = 0 | 1 | 2; // 0=Easy, 1=Medium, 2=Hard
export type VisibilityLevel = 0 | 1 | 2; // 0=Private, 1=FriendsOnly, 2=Public
