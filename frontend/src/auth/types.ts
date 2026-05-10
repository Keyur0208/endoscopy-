import type { IUserProfile } from 'src/types/user';

export type UserType = Record<string, any> | null;

export type AuthState = {
  user: IUserProfile | null;
  loading: boolean;
};

export type AuthContextValue = {
  user: IUserProfile | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};
