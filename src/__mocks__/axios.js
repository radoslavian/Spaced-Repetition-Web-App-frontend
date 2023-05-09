import { authToken, userData, userCategories } from "./mockData";

const categoriesUrlMatch = /\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/categories\/?$/i;
const BASE_API_URL =  "http://localhost:8000";
const BASE_URL = BASE_API_URL + "/api";

export const axiosMatch = {
    post: jest.fn(() => Promise.resolve({ data: authToken })),
    get: jest.fn().mockImplementation(config => {
        if (config.url.includes("/auth/users/me/")) {
            return Promise.resolve({ data: userData });
        } else if (categoriesUrlMatch.test(config.url)) {
            return Promise.resolve({ data: userCategories });
        }
        else {
            console.error("Placeholder return in __mocks__/axios.js - url: ",
                          config.url);
            return 1;
        }
    }),
    put: jest.fn(() => {
        return Promise.resolve({ status: 204 });
    })
};

function axios(config) {
    switch(config.method) {
    case "post":
        return axiosMatch.post(config);
        break;
    case "get":
        return axiosMatch.get(config);
        break;
    case "put":
        return axiosMatch.put(config);
        break;
    }
}

export default axios;

