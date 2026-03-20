import { FC, useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import {
  fetchFeeds,
  fetchProfileOrders,
  selectFeedLoading,
  selectFeedOrders,
  selectProfileOrders
} from '../../services/slices/feedSlice';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectFeedLoading);

  const isProfileOrderRoute = location.pathname.startsWith('/profile/orders');

  const orders = isProfileOrderRoute ? profileOrders : feedOrders;

  useEffect(() => {
    if (isProfileOrderRoute && !profileOrders.length) {
      dispatch(fetchProfileOrders());
    }

    if (!isProfileOrderRoute && !feedOrders.length) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, isProfileOrderRoute, profileOrders.length, feedOrders.length]);

  const orderData = useMemo(
    () => orders.find((item: TOrder) => item.number === Number(number)) || null,
    [orders, number]
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);

          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
