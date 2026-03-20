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

        cy.get('[data-cy="ingredient-add-643d69a5c3f7b9001cfa093c"]')
            .contains('Добавить')
            .click({ force: true });

        cy.get('[data-cy="ingredient-add-643d69a5c3f7b9001cfa0941"]')
            .contains('Добавить')
            .click({ force: true });

        cy.contains('Выберите булки').should('not.exist');
        cy.contains('Выберите начинку').should('not.exist');
        cy.get('[data-cy="burger-constructor"]').should(
            'contain',
            'Биокотлета из марсианской Магнолии'
        );
    });

    it('открывает модальное окно ингредиента и закрывает его по клику на крестик', () => {
        cy.get('[data-cy="ingredient-link-643d69a5c3f7b9001cfa0943"]').click();

        cy.get('[data-cy="modal"]').should('exist');
        cy.get('[data-cy="ingredient-details-name"]').should(
            'contain',
            'Соус фирменный Space Sauce'
        );

        cy.get('[data-cy="modal-close"]').click();
        cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('закрывает модальное окно ингредиента по клику на оверлей', () => {
        cy.get('[data-cy="ingredient-link-643d69a5c3f7b9001cfa0943"]').click();

        cy.get('[data-cy="modal"]').should('exist');
        cy.get('[data-cy="modal-overlay"]').click({ force: true });
        cy.get('[data-cy="modal"]').should('not.exist');
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

        cy.get('[data-cy="ingredient-add-643d69a5c3f7b9001cfa093c"]')
            .contains('Добавить')
            .click({ force: true });

        cy.get('[data-cy="ingredient-add-643d69a5c3f7b9001cfa0941"]')
            .contains('Добавить')
            .click({ force: true });

        cy.get('[data-cy="order-button"]').click();
        cy.location('pathname').should('eq', '/');

        cy.get('[data-cy="modal"]').should('exist');
        cy.get('[data-cy="order-number"]').should('contain', '12345');

        cy.get('[data-cy="modal-close"]').click();
        cy.get('[data-cy="modal"]').should('not.exist');

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