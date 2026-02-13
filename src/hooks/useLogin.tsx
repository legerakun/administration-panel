import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { getUser } from '@/redux/user/selectors';
import { useSelector } from '@/redux/hooks';
import { PATH } from '@/app/router';

export const useLogin = (path?: keyof typeof PATH) => {
  const { user } = useSelector(getUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.accessToken) {
      navigate(PATH.LOGIN);

      return;
    }

    navigate(path || PATH.PRODUCTS);
  }, [navigate, path, user]);
};
