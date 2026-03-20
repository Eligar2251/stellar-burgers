Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid'
  }
});

import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp
} from './constructorSlice';

describe('burgerConstructor reducer', () => {
  const bun = {
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
  };

  const main1 = {
    _id: '2',
    name: 'Котлета',
    type: 'main' as const,
    proteins: 20,
    fat: 20,
    carbohydrates: 20,
    calories: 200,
    price: 200,
    image: 'main1.png',
    image_mobile: 'main1-mobile.png',
    image_large: 'main1-large.png'
  };

  const main2 = {
    _id: '3',
    name: 'Соус',
    type: 'sauce' as const,
    proteins: 5,
    fat: 5,
    carbohydrates: 5,
    calories: 50,
    price: 50,
    image: 'main2.png',
    image_mobile: 'main2-mobile.png',
    image_large: 'main2-large.png'
  };

  it('обрабатывает добавление булки', () => {
    const state = constructorReducer(undefined, addIngredient(bun));

    expect(state.bun).toEqual(bun);
    expect(state.ingredients).toEqual([]);
  });

  it('обрабатывает добавление начинки', () => {
    const state = constructorReducer(undefined, addIngredient(main1));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(main1);
    expect(state.ingredients[0]).toHaveProperty('id');
  });

  it('обрабатывает удаление ингредиента', () => {
    const stateWithIngredients = constructorReducer(
      undefined,
      addIngredient(main1)
    );

    const ingredientId = stateWithIngredients.ingredients[0].id;

    const state = constructorReducer(
      stateWithIngredients,
      removeIngredient(ingredientId)
    );

    expect(state.ingredients).toHaveLength(0);
  });

  it('обрабатывает изменение порядка ингредиентов вниз', () => {
    const state1 = constructorReducer(undefined, addIngredient(main1));
    const state2 = constructorReducer(state1, addIngredient(main2));

    const state3 = constructorReducer(state2, moveIngredientDown(0));

    expect(state3.ingredients[0].name).toBe('Соус');
    expect(state3.ingredients[1].name).toBe('Котлета');
  });

  it('обрабатывает изменение порядка ингредиентов вверх', () => {
    const state1 = constructorReducer(undefined, addIngredient(main1));
    const state2 = constructorReducer(state1, addIngredient(main2));

    const state3 = constructorReducer(state2, moveIngredientUp(1));

    expect(state3.ingredients[0].name).toBe('Соус');
    expect(state3.ingredients[1].name).toBe('Котлета');
  });
});