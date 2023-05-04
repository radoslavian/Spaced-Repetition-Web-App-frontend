import { jest } from '@jest/globals';

const authToken = {
    auth_token: "7f3371589a52d0ef17877c61d1c82cdf9b7d8f3f"
};


export default {
    post: jest.fn(() => Promise.resolve({ data: {auth_token: authToken} }))
};
