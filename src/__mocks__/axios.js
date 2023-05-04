const authToken = { auth_token: "7f3371589a52d0ef17877c61d1c82cdf9b7d8f3f" };
const userData = {
    email: "user@userdomain.com.su",
    id: "626e4d32-a52f-4c15-8f78-aacf3b69a9b2",
    username: "user_name"
};

const get = jest.fn();

// returns 'undefined' even though configured to do otherwise
const axios = {
    post: jest.fn(() => Promise.resolve({data: authToken})),
    get: jest.fn(() => Promise.resolve({data: userData}))
};

export default axios;
