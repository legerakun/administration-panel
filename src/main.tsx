import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router';

import { ProductsPage } from '@/pages/products/ProductsPage';
import { IndexPage } from '@/pages/index/IndexPage';
import { LoginPage } from '@/pages/login/LoginPage';
import { ListLayout } from '@/layout/ListLayout';
import { store } from '@/redux/store';
import { PATH } from '@/app/router';

import '@/index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path={PATH.INDEX} element={<IndexPage />} />
          <Route path={PATH.LOGIN} element={<LoginPage />} />
          <Route element={<ListLayout />}>
            <Route path={PATH.PRODUCTS} element={<ProductsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
