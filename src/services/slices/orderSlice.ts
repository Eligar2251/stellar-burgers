import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { RootState } from '../store';
import { clearConstructor } from './constructorSlice';

type TOrderModalData = {
  number: number;
  name: string;
};

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrderModalData | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrderModalData,
  void,
  { state: RootState }
>('order/create', async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    const state = getState();
    const { bun, ingredients } = state.burgerConstructor;

    if (!bun) {
      return rejectWithValue('Не выбрана булка');
    }

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    const response = await orderBurgerApi(ingredientsIds);

    dispatch(clearConstructor());

    return {
      number: response.order.number,
      name: response.name
    };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось оформить заказ'
    );
  }
});

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
      state.error = null;
    }
  },
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = (action.payload as string) || 'Не удалось оформить заказ';
      });
  }
});

export const { clearOrderModalData } = orderSlice.actions;

export const { selectOrderRequest, selectOrderModalData, selectOrderError } =
  orderSlice.selectors;

export default orderSlice.reducer;
