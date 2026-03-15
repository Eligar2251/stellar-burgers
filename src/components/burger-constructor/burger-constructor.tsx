import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectConstructorItems } from '../../services/slices/constructorSlice';
import {
  clearOrderModalData,
  createOrder,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/slices/orderSlice';
import { selectIsAuthenticated } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isAuth = useSelector(selectIsAuthenticated);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!isAuth) {
      navigate('/login', { state: { from: location } });
      return;
    }

    dispatch(createOrder());
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
