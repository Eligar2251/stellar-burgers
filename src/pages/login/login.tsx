import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginUser,
  selectIsAuthenticated,
  selectUserError
} from '../../services/slices/userSlice';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const errorText = useSelector(selectUserError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      loginUser({
        email,
        password
      })
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <LoginUI
      errorText={errorText || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
