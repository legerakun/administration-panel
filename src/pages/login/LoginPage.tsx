import { useNavigate } from 'react-router';
import { useMemo, useState } from 'react';

import { useDispatch } from '@/redux/hooks';
import { getUserThunk } from '@/redux/user/thunks';
import { CloseIcon } from './components/CloseIcon';
import { LogoIcon } from './components/LogoIcon';
import { UserIcon } from './components/UserIcon';
import { LockIcon } from './components/LockIcon';
import { User as UserType } from '@/axios/types';
import { EyeIcon } from './components/EyeIcon';
import { PATH } from '@/app/router';

import s from '@/pages/login/LoginPage.module.scss';
import { useLogin } from '@/hooks/useLogin';

type FieldErrors = Partial<Record<'username' | 'password', string>>;

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const canSubmit = useMemo(() => !submitting, [submitting]);

  useLogin();

  return (
    <main className={s.app}>
      <div className={s.login}>
        <div className={s.loginCard}>
          <div className={s.loginCard__content}>
            <div className={s.loginCard_logo}>
              <LogoIcon />
            </div>
            <div className={s.loginCard__text}>
              <h2 className={s.loginCard__title}>Добро пожаловать!</h2>
              <h4 className={s.loginCard__subtitle}>Пожалуйста, авторизируйтесь</h4>
            </div>
            <form
              className={s.loginForm}
              onSubmit={async (e) => {
                e.preventDefault();

                setFormError(null);

                const nextErrors: FieldErrors = {};

                if (!username.trim()) nextErrors.username = 'Введите логин';
                if (!password.trim()) nextErrors.password = 'Введите пароль';
                setFieldErrors(nextErrors);
                if (Object.keys(nextErrors).length > 0) return;

                setSubmitting(true);
                try {
                  const data = { username: username.trim(), password };
                  const { payload } = (await dispatch(getUserThunk({ userData: data, remember }))) as {
                    payload: UserType;
                  };

                  if (payload.accessToken) {
                    navigate(PATH.PRODUCTS);
                  } else {
                    setFormError('Неправильный логин или пароль.');
                  }
                } catch (err) {
                  // error handling
                  console.log(err);
                  setFormError('');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <label className={s.field}>
                <div className={s.field__label}>Логин</div>
                <div className={`${s.inputShell} ${fieldErrors.username ? s.inputShell__error : ''}`}>
                  <div className={s.inputShell__icon}>
                    <UserIcon />
                  </div>
                  <input
                    id="login"
                    className={s.inputShell__input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                  <div className={s.inputShell__action}>
                    {username ? (
                      <button
                        type="button"
                        className={s.iconAction}
                        aria-label="Очистить"
                        onClick={() => setUsername('')}
                      >
                        <CloseIcon />
                      </button>
                    ) : null}
                  </div>
                </div>
                {fieldErrors.username ? <div className={s.field__error}>{fieldErrors.username}</div> : null}
              </label>

              <label className={s.field}>
                <div className={s.field__label}>Пароль</div>
                <div className={`${s.inputShell} ${fieldErrors.password ? s.inputShell__error : ''}`}>
                  <div className={s.inputShell__icon}>
                    <LockIcon />
                  </div>
                  <input
                    id="password"
                    className={s.inputShell__input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                  />
                  <div className={s.inputShell__action}>
                    <button
                      type="button"
                      className={s.iconAction}
                      aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      <EyeIcon />
                    </button>
                  </div>
                </div>
                {fieldErrors.password ? <div className={s.field__error}>{fieldErrors.password}</div> : null}
              </label>

              <label className={s.rememberRow}>
                <input
                  id="remember"
                  className={s.rememberRow__checkbox}
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Запомнить данные</span>
              </label>

              {formError ? <div className={s.formError}>{formError}</div> : null}

              <button className={s.loginButton} type="submit" disabled={!canSubmit}>
                {submitting ? 'Входим…' : 'Войти'}
              </button>

              <div className={s.loginDivider}>
                <span>или</span>
              </div>
            </form>
            <div className={s.loginBottom}>
              Нет аккаунта?{' '}
              <a
                className={s.loginLink}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Создать
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
