import { rootReducer } from './store';

describe('rootReducer', () => {
  it('возвращает корректное начальное состояние при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        items: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        isAuthenticated: false,
        loginRequest: false,
        registerRequest: false,
        updateUserRequest: false,
        logoutRequest: false,
        error: null,
        updateUserError: null
      },
      feed: {
        feed: {
          orders: [],
          total: 0,
          totalToday: 0
        },
        profileOrders: [],
        isLoading: false,
        error: null
      }
    });
  });
});