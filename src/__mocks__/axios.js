import {
    authToken, authToken_1, userData, userCategories, memorizedCardsSecondPage,
    memorizedCardsThirdPage, memorizedCardsFirstPage, queuedCardsFirstPage,
    queuedCardsMiddlePage, queuedCardsThirdPage, outstandingMiddlePage,
    outstandingPrevPage, outstandingNextPage, allCardsMiddle, allCardsNext,
    allCardsPrev, memorizedCard, allCardsNext_1, cramQueueFirstPage,
    cramQueueSecondPage, cramQueueThirdPage, reviewSuccess, outstandingEmpty
} from "./mockData";

const addToCramRoute = /\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/cram-queue\/$/;
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
const memorizeRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/queued\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-z][0-9a-f]{3}-[0-9a-f]{12}$/;
const cramQueueMiddleRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/cram-queue\/$/;
const cramQueueNextRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/cram-queue\/\?page=3$/;
const cramQueuePrevRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/cram-queue\/\?page=1$/;
const gradeSuccessRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/memorized\/7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa$/;
const gradeFailRoute = /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89az][0-9a-f]{3}-[0-9a-f]{12}\/cards\/memorized\/c0320d44-c157-4857-a2b8-39ce89d168f5$/;
const apiClientAbsoluteUrlTest = /http:\/\/localhost:8000\/test\/url/;

export const downloadCards = jest.fn();
export const categoriesCalls = jest.fn();
export const gradeCard = jest.fn();

export const axiosMatch = {
    post: jest.fn().mockImplementation(config => {
	if (config.data.user === "CardsReviewer_user") {
	    return Promise.resolve({ data: authToken_1 });
	} else if (config.data.user === "user_1") {
	    return Promise.resolve({ data: authToken });
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
            case `Token ${authToken.auth_token}`:
		return Promise.resolve({ data: outstandingMiddlePage });
		break;
	    case `Token ${authToken_1.auth_token}`:
		// data returned for testing transition between reviewing
		// scheduled cards and memorizing new ones
		return Promise.resolve({ data: outstandingEmpty });
		break;
	    default:
		throw new Error(
		    "No pattern matched in outstandingCardsMainPageRoute");
	    }
        }
        else if (cramQueueMiddleRoute.test(config.url)) {
            return Promise.resolve({ data: cramQueueSecondPage });
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
            return Promise.resolve({ data: queuedCardsMiddlePage });
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
        else if(addToCramRoute.test(config.url)) {
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
        // currently only response for APIClient's delete method
        return Promise.resolve({ data: { status: 204 } });
    }),
    patch: jest.fn().mockImplementation(config => {
	if (memorizeRoute.test(config.url)) {
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

