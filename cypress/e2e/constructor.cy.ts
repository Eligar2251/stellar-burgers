const selectors = {
  burgerConstructor: '[data-cy="burger-constructor"]',
  modal: '[data-cy="modal"]',
  modalClose: '[data-cy="modal-close"]',
  modalOverlay: '[data-cy="modal-overlay"]',
  ingredientDetailsName: '[data-cy="ingredient-details-name"]',
  orderButton: '[data-cy="order-button"]',
  orderNumber: '[data-cy="order-number"]',
  bunAddButton: '[data-cy="ingredient-add-643d69a5c3f7b9001cfa093c"]',
  mainAddButton: '[data-cy="ingredient-add-643d69a5c3f7b9001cfa0941"]',
  sauceLink: '[data-cy="ingredient-link-643d69a5c3f7b9001cfa0943"]'
};

const addIngredient = (selector: string) => {
  cy.get(selector).contains('Добавить').click({ force: true });
};

const closeModal = () => {
  cy.get(selectors.modalClose).click();
  cy.get(selectors.modal).should('not.exist');
};

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('добавляет ингредиент из списка в конструктор', () => {
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');

    addIngredient(selectors.bunAddButton);
    addIngredient(selectors.mainAddButton);

    cy.contains('Выберите булки').should('not.exist');
    cy.contains('Выберите начинку').should('not.exist');
    cy.get(selectors.burgerConstructor).should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
  });

  it('открывает модальное окно ингредиента и закрывает его по клику на крестик', () => {
    cy.get(selectors.sauceLink).click();

    cy.get(selectors.modal).should('exist');
    cy.get(selectors.ingredientDetailsName).should(
      'contain',
      'Соус фирменный Space Sauce'
    );

    closeModal();
  });

  it('закрывает модальное окно ингредиента по клику на оверлей', () => {
    cy.get(selectors.sauceLink).click();

    cy.get(selectors.modal).should('exist');
    cy.get(selectors.modalOverlay).click({ force: true });
    cy.get(selectors.modal).should('not.exist');
  });

  it('создаёт заказ', () => {
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    cy.setCookie('accessToken', 'Bearer fake-access-token');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');

    addIngredient(selectors.bunAddButton);
    addIngredient(selectors.mainAddButton);

    cy.get(selectors.orderButton).click();
    cy.location('pathname').should('eq', '/');

    cy.get(selectors.modal).should('exist');
    cy.get(selectors.orderNumber).should('contain', '12345');

    closeModal();

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });
});