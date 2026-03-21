import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';

describe('ingredients reducer', () => {
  const mockIngredients = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun' as const,
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 100,
      image: 'bun.png',
      image_mobile: 'bun-mobile.png',
      image_large: 'bun-large.png'
    },
    {
      _id: '2',
      name: 'Котлета',
      type: 'main' as const,
      proteins: 20,
      fat: 20,
      carbohydrates: 20,
      calories: 200,
      price: 200,
      image: 'main.png',
      image_mobile: 'main-mobile.png',
      image_large: 'main-large.png'
    }
  ];

  it('обрабатывает экшен pending', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.pending('', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает экшен fulfilled', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.fulfilled(mockIngredients, '', undefined)
    );

    expect(state.items).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('обрабатывает экшен rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };

    const state = ingredientsReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});