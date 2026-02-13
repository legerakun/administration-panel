import axios from 'axios';

import { UserData, Products, User } from './types';

const authService = 'https://dummyjson.com';
const productsService = 'https://dummyjson.com';

const instance = axios.create();

const api = {
  getUser: (data: UserData) => instance.post<User>(`${authService}/auth/login`, data),
  getProducts: (limit?: number, skip?: number) =>
    instance.get<Products>(
      `${productsService}/products?limit=${encodeURIComponent(String(limit || 5))}&skip=${encodeURIComponent(String(skip || 0))}`
    ),
  searchProducts: (query: string, limit?: number, skip?: number) =>
    instance.get<Products>(
      `${productsService}/products/search?q=${encodeURIComponent(query)}&limit=${encodeURIComponent(String(limit || 5))}&skip=${encodeURIComponent(String(skip || 0))}`
    )
};

export default api;
