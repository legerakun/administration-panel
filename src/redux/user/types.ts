import { User } from '@/axios/types';
import { DataErrors } from './config';

export type UserState = {
  user: User | undefined;
  loading: boolean;
  error: DataErrors | undefined;
};

export type setUserPayload = {
  user: User;
  remember: boolean;
};
