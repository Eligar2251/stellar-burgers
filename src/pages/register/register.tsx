import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  registerUser,
  selectIsAuthenticated,
  selectUserError
} from '../../services/slices/userSlice';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const errorText = useSelector(selectUserError);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      registerUser({
        name: userName,
        email,
        password
      })
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <RegisterUI
      errorText={errorText || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
