import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const { pathname } = useLocation();

  const isConstructorActive =
    pathname === '/' || pathname.startsWith('/ingredients/');

  const isFeedActive = pathname === '/feed' || pathname.startsWith('/feed/');

  const isProfileActive = pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink to='/' end className={styles.link}>
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 mr-10 ${
                isConstructorActive ? '' : 'text_color_inactive'
              }`}
            >
              Конструктор
            </p>
          </NavLink>

          <NavLink to='/feed' className={styles.link}>
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${
                isFeedActive ? '' : 'text_color_inactive'
              }`}
            >
              Лента заказов
            </p>
          </NavLink>
        </div>

        <NavLink to='/' className={styles.logo}>
          <Logo className='' />
        </NavLink>

        <div className={styles.link_position_last}>
          <NavLink to='/profile' className={styles.link}>
            <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${
                isProfileActive ? '' : 'text_color_inactive'
              }`}
            >
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
