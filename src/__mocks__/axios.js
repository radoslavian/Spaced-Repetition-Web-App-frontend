import {
    authToken, userData, userCategories, memorizedCardsSecondPage,
    memorizedCardsThirdPage, memorizedCardsFirstPage, queuedCardsFirstPage,
    queuedCardsMiddlePage, queuedCardsThirdPage, outstandingMiddlePage,
    outstandingPrevPage, outstandingNextPage, allCardsMiddle, allCardsNext,
    allCardsPrev
} from "./mockData";

const categoriesUrlMatch = /\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/categories\/?$/i;
const memorizedCards = /\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/memorized\/$/;
const memCardsFirstPage = /\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/memorized\/\?page=1/;
const memCardsThirdPage = /\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/memorized\/\?page=3/;

const queuedCardsMainPageRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/queued\/$/;
const queuedCardsFirstPageRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/queued\/\?page=1$/;
const queuedCardsThirdPageRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/queued\/\?page=3$/;
const outstandingCardsPrevPageRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/outstanding\/\?page=2$/;
const outstandingCardsMainPageRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/outstanding\/$/;
const outstandingCardsNextPageRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/outstanding\/\?page=3$/;
const allCardsMiddleRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/$/;
const allCardsNextRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/\?limit=20&offset=40$/;
const allCardsPrevRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/\?limit=20$/;

const apiClientAbsoluteUrlTest = /http:\/\/localhost:8000\/test\/url/;

export const axiosMatch = {
    post: jest.fn(() => Promise.resolve({ data: authToken })),
    get: jest.fn().mockImplementation(config => {
        if (config.url.includes("/auth/users/me/")) {
            return Promise.resolve({ data: userData });
        }
        else if (allCardsPrevRoute.test(config.url)) {
            return Promise.resolve({ data: allCardsPrev });
        }
        else if (allCardsNextRoute.test(config.url)) {
            return Promise.resolve({ data: allCardsNext });
        }
        else if (allCardsMiddleRoute.test(config.url)) {
            return Promise.resolve({ data: allCardsMiddle });
        }
        else if (outstandingCardsPrevPageRoute.test(config.url)) {
            return Promise.resolve({ data: outstandingPrevPage });
        }
        else if (outstandingCardsNextPageRoute.test(config.url)) {
            return Promise.resolve({ data: outstandingNextPage });
        }
        else if (outstandingCardsMainPageRoute.test(config.url)) {
            return Promise.resolve({ data: outstandingMiddlePage });
        }
        else if (queuedCardsFirstPageRoute.test(config.url)) {
            return Promise.resolve({ data: queuedCardsFirstPage });
        }
        else if (queuedCardsMainPageRoute.test(config.url)) {
            return Promise.resolve({ data: queuedCardsMiddlePage });
        }
        else if (queuedCardsThirdPageRoute.test(config.url)) {
            return Promise.resolve({ data: queuedCardsThirdPage });
        }
        else if (categoriesUrlMatch.test(config.url)) {
            return Promise.resolve({ data: userCategories });
        }
        else if (memorizedCards.test(config.url)) {
            return Promise.resolve({ data: memorizedCardsSecondPage });
        }
        else if (memCardsThirdPage.test(config.url)) {
            return Promise.resolve({ data: memorizedCardsThirdPage });
        }
        else if (memCardsFirstPage.test(config.url)) {
            return Promise.resolve({ data: memorizedCardsFirstPage });
        }
        else if (apiClientAbsoluteUrlTest.test(config.url)) {
            return Promise.resolve({ data: "correct response" });
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

