import { Products } from '@/axios/types';
import { DataErrors } from './config';

export type ProductsState = {
  products: Products | undefined;
  loading: boolean;
  error: DataErrors | undefined;
};
