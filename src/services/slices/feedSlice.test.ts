import feedReducer, { fetchFeeds } from './feedSlice';

describe('feed reducer', () => {
    const mockFeedResponse = {
        orders: [
            {
                _id: '1',
                ingredients: ['1', '2'],
                status: 'done' as const,
                name: 'Тестовый заказ',
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
                number: 123
            }
        ],
        total: 10,
        totalToday: 5
    };

    it('обрабатывает экшен pending', () => {
        const state = feedReducer(undefined, fetchFeeds.pending('', undefined));

        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('обрабатывает экшен fulfilled', () => {
        const action = {
            type: fetchFeeds.fulfilled.type,
            payload: mockFeedResponse
        };

        const state = feedReducer(undefined, action);

        expect(state.isLoading).toBe(false);
        expect(state.feed).toEqual(mockFeedResponse);
        expect(state.error).toBeNull();
    });

    it('обрабатывает экшен rejected', () => {
        const state = feedReducer(
            undefined,
            fetchFeeds.rejected(new Error(), '', undefined, 'Ошибка загрузки')
        );

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Ошибка загрузки');
    });
});