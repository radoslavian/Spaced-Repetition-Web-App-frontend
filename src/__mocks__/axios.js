import {
    authToken, authToken_1, authToken_2, userData, userCategories,
    memorizedCardsSecondPage, memorizedCardsThirdPage, memorizedCardsFirstPage,
    queuedCardsFirstPage, queuedCardsMiddlePage, queuedCardsThirdPage,
    outstandingMiddlePage, outstandingPrevPage, outstandingNextPage, allCardsMiddle,
    allCardsNext, allCardsPrev, memorizedCard, allCardsNext_1, cramQueueFirstPage,
    cramQueueSecondPage, cramQueueThirdPage, reviewSuccess, emptyCardsList,
    queuedCard, allCardsSearchResults, cardsDistribution_12Days
} from "./mockData";

const cramQueueRoute = /\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/cram-queue\/$/;
const categoriesUrlMatch = /\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/categories\/?$/i;
const categoriesSelectedUrlRoute = /\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/categories\/selected\/?$/;
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
const allCardsNext_1_route = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/\?limit=20&offset=60$/;
const allCardsPrevRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/\?limit=20$/;
const queuedCardRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/queued\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-z][0-9a-f]{3}-[0-9a-f]{12}$/;
const cramQueueMiddleRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/cram-queue\/$/;
const cramQueueNextRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/cram-queue\/\?page=3$/;
const cramQueuePrevRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/cram-queue\/\?page=1$/;
const gradeSuccessRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/memorized\/7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa$/;
const gradeFailRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/memorized\/c0320d44-c157-4857-a2b8-39ce89d168f5$/;
const forgetCardRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/memorized\/5b457c11-b751-436c-9cfe-f3f4d173c1ba$/;
const failedForgetCardRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/memorized\/4a58594b-1c84-41f5-b4f0-72dc573b6406$/;
const searchAllCardsRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/\?search\=[\w\+]+/;
const apiClientAbsoluteUrlTest = /http:\/\/localhost:8000\/test\/url/;
const cardsDistribution_12DaysRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/distribution\/\?days-range=\w+$/;

export const downloadCards = jest.fn();
export const categoriesCalls = jest.fn();
export const gradeCard = jest.fn();
export const forgetCard = jest.fn();
export const getQueuedCard = jest.fn();
export const dropCram = jest.fn();
export const searchAllCards = jest.fn();

export const axiosMatch = {
    post: jest.fn().mockImplementation(config => {
	if (config.data.user === "CardsReviewer_user") {
	    return Promise.resolve({ data: authToken_1 });
	} else if (config.data.user === "user_1") {
	    return Promise.resolve({ data: authToken });
        } else if (config.data.user === "user_2") {
	    return Promise.resolve({ data: authToken_2 });
	} else {
	    return Promise.reject(
                { data: "wrong authentication credentials" });
	}
    }),

    get: jest.fn().mockImplementation(config => {
	if (config.headers?.Authorization === undefined) {
	    return Promise.reject({ data: "unauthorized" });
	}
        if (config.url.includes("/auth/users/me/")) {
            return Promise.resolve({ data: userData });
        }
	else if (cardsDistribution_12DaysRoute.test(config.url)) {
	    return Promise.resolve({ data: cardsDistribution_12Days });
	}
        else if (searchAllCardsRoute.test(config.url)) {
            searchAllCards(config);
            return Promise.resolve({ data: allCardsSearchResults });
        }
        else if (queuedCardRoute.test(config.url)) {
            getQueuedCard(config);
	    return Promise.resolve({ data: queuedCard });
	}
        else if (allCardsNext_1_route.test(config.url)) {
            return Promise.resolve({ data: allCardsNext_1 });
        }
        else if (allCardsPrevRoute.test(config.url)) {
            return Promise.resolve({ data: allCardsPrev });
        }
        else if (allCardsNextRoute.test(config.url)) {
            return Promise.resolve({ data: allCardsNext });
        }
        else if (allCardsMiddleRoute.test(config.url)) {
            downloadCards(config);
            return Promise.resolve({ data: allCardsMiddle });
        }
        else if (outstandingCardsPrevPageRoute.test(config.url)) {
            return Promise.resolve({ data: outstandingPrevPage });
        }
        else if (outstandingCardsNextPageRoute.test(config.url)) {
            return Promise.resolve({ data: outstandingNextPage });
        }
        else if (outstandingCardsMainPageRoute.test(config.url)) {
	    switch(config.headers.Authorization) {
	    case `Token ${authToken_1.auth_token}`:
		return Promise.resolve({ data: emptyCardsList });
	    default:
                return Promise.resolve({ data: outstandingMiddlePage });
		throw new Error(
		    "No pattern matched in outstandingCardsMainPageRoute");
	    }
        }
        else if (cramQueueMiddleRoute.test(config.url)) {
	    switch(config.headers.Authorization) {
            case `Token ${authToken_1.auth_token}`:
                return Promise.resolve({ data: emptyCardsList });
            case `Token ${authToken_2.auth_token}`:
                const cramPage = { ...cramQueueThirdPage,
                                   count: 1,
                                   previous: null };
                return Promise.resolve({ data: cramPage });
	    default:
                return Promise.resolve({ data: cramQueueSecondPage });
	    }
        }
        else if (cramQueueNextRoute.test(config.url)) {
            return Promise.resolve({ data: cramQueueThirdPage });
        }
        else if (cramQueuePrevRoute.test(config.url)) {
            return Promise.resolve({ data: cramQueueFirstPage });
        }
        else if (queuedCardsFirstPageRoute.test(config.url)) {
            return Promise.resolve({ data: queuedCardsFirstPage });
        }
        else if (queuedCardsMainPageRoute.test(config.url)) {
            switch(config.headers.Authorization) {
            case `Token ${authToken.auth_token}`:
                return Promise.resolve({ data: queuedCardsMiddlePage });
	    case `Token ${authToken_1.auth_token}`:
		return Promise.resolve({ data: emptyCardsList });
            case `Token ${authToken_2.auth_token}`:
		return Promise.resolve({ data: emptyCardsList });
	    default:
		throw new Error(
		    "No pattern matched in queuedCardsMainPageRoute");
	    }
        }
        else if (queuedCardsThirdPageRoute.test(config.url)) {
            return Promise.resolve({ data: queuedCardsThirdPage });
        }
        else if (categoriesUrlMatch.test(config.url)) {
            categoriesCalls(config);
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
    put: jest.fn().mockImplementation(config => {
        if (categoriesUrlMatch.test(config.url)) {
            return Promise.resolve({ status: 204 });
        }
        else if (categoriesSelectedUrlRoute.test(config.url)) {
            return Promise.resolve({ status: 204 });
        }
        else if(cramQueueRoute.test(config.url)) {
            return Promise.resolve(
                {
                    data: {
                        "id": "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa",
                    }
                }
            );
        }
        else {
            console.error("Placeholder return in __mocks__/axios.js"
                          + "(put) - url: ", config.url);
            return 1;
        }
    }),
    delete: jest.fn().mockImplementation(config => {
	if (forgetCardRoute.test(config.url)) {
	    forgetCard(config);
	} else if (failedForgetCardRoute.test(config.url)) {
            console.error("not found");
            return Promise.reject({ data: undefined });
        } else if (cramQueueRoute.test(config.url)) {
	    dropCram(config);
	}
        return Promise.resolve({ data: "" });
    }),
    patch: jest.fn().mockImplementation(config => {
	if (queuedCardRoute.test(config.url)) {
	    return Promise.resolve({ data: memorizedCard });
	}
        else if (gradeSuccessRoute.test(config.url)) {
            gradeCard(config);
            return Promise.resolve({ data: reviewSuccess });
        }
        else if (gradeFailRoute.test(config.url)) {
            const data = {
                "status_code": 400,
                "detail": "Reviewing before card's due "
                    + "review date is forbidden."
            };
            return Promise.resolve({ data: data });
        }
	else {
	    console.error("Placeholder return in __mocks__/axios.js "
                          +" (patch) - url: ", config.url);
            return 1;
	}
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
    case "patch":
	return axiosMatch.patch(config);
	break;
    case "delete":
        return axiosMatch.delete(config);
    }
}

export default axios;

