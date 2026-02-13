import { Outlet } from 'react-router';

import { useLogin } from '@/hooks/useLogin';

export const ListLayout = () => {
  useLogin();

  return (
    <div className="app">
      <main className="app__main app__main--login">
        <Outlet />
      </main>
    </div>
  );
};
