import { render, act, waitFor, screen, within } from "@testing-library/react";
import { useRef, useEffect } from "react";
import axios, { axiosMatch } from "axios";
import { UserProvider, useUser } from "./contexts/UserProvider";
import { ApiProvider, useApi } from "./contexts/ApiProvider";
import { timeOut } from "./utils/helpers";
import { CategoriesProvider,
         useCategories } from "./contexts/CategoriesProvider";
import { CardsProvider, useCards } from "./contexts/CardsProvider.js";
import CategorySelector from "./components/CategorySelector.js";
import { memorizedCardsSecondPage } from "./__mocks__/mockData";

describe("<ApiProvider/>", () => {
    function FakeComponent() {
        const api = useApi();
        const credentials = {user: "user1",
                             password: "passwd"};
        api.authenticate("/auth/token/login/", credentials);
        return (<></>);
    }

    beforeAll(() => {
        render(
            <ApiProvider>
              <FakeComponent/>
            </ApiProvider>
        );
    });

    test("calling authentication route", () => {
        const loginRoute = "http://localhost:8000/api/auth/token/login/";
        expect(axiosMatch.post).toHaveBeenCalledTimes(1);
        expect(axiosMatch.post).toHaveBeenCalledWith(
            {"data":
             {"password": "passwd", "user": "user1"},
             "headers": {"Content-Type": "application/json"},
             "method": "post",
             "url": "http://localhost:8000/api/auth/token/login/"});
    });
});

describe("<UserProvider/>", () => {
    const TestingComponent = () => {
        const api = useApi();
        const credentials = {user: "user1",
                             password: "passwd"};
        api.authenticate("/auth/token/login/", credentials);
        const { user } = useUser();
        return (
            <div>
              <p>{ user?.email }</p>
              <p>{ user?.id }</p>
              <p>{ user?.username }</p>
            </div>
        );
    };

    beforeEach(async () => {
        await act(async () => render(
            <ApiProvider>
              <UserProvider>
                <TestingComponent/>
              </UserProvider>
            </ApiProvider>
        ));
    });

    afterAll(jest.clearAllMocks);

    test("if the component returned user email from the provider", () => {
        const userData = {
            email: "user@userdomain.com.su",
            id: "626e4d32-a52f-4c15-8f78-aacf3b69a9b2",
            username: "django_root"
        };
        const userEmail = screen.getByText("user@userdomain.com.su");
        expect(userEmail).toBeInTheDocument();
    });

    test("if the component returned user id from the provider", () => {
        const userId = screen.getByText(
            "626e4d32-a52f-4c15-8f78-aacf3b69a9b2");
        expect(userId).toBeInTheDocument();
    });

    test("if the component returned username from the provider", () => {
        const userName = screen.getByText("user_name");
        waitFor(() => expect(userName).toBeInTheDocument());
    });
});

describe("<CategoriesProvider/>", () => {
    const TestingComponent = () => {
        const api = useApi();
        const credentials = {user: "user1",
                             password: "passwd"};
        const { categories, selectedCategories,
                setSelectedCategories } = useCategories();
        const called = useRef(false);

        if (!called.current) {
            (async () => {
                await api.authenticate("/auth/token/login/", credentials);
                await timeOut(10);
                setSelectedCategories(
                    ["6d18daff-94d1-489b-97ce-969d1c2912a6"]);
                if (categories != []) {
                    called.current = true;
                }
            })();
        }

        return(<>
                 <div data-testid="test-component-categories">
                   { JSON.stringify(categories) }
                 </div>
                 <div data-testid="test-component-selected-categories">
                   { JSON.stringify(selectedCategories) }
                 </div>
               </>);
    };

    beforeEach(async () => await act(async () => render(
        <ApiProvider>
          <UserProvider>
            <CategoriesProvider>
              <TestingComponent/>
            </CategoriesProvider>
          </UserProvider>
        </ApiProvider>
    )));

    afterAll(jest.clearAllMocks);

    test("if route for downloading categories has been called", () => {
        const route = "http://localhost:8000/api/users/"
              + "626e4d32-a52f-4c15-8f78-aacf3b69a9b2/categories/";
        const options = {"headers":
                         {"Authorization":
                          "Token 7f3371589a52d0ef17877c61d1c82cdf9b7d8f3f",
                          "Content-Type": "application/json"},
                         "method": "get",
                         "url": "http://localhost:8000/api/users/626e4d32-a5"
                         + "2f-4c15-8f78-aacf3b69a9b2/categories/"};

        // once for users.../me, once for obtaining categories
        expect(axiosMatch.get).toHaveBeenCalledTimes(2);
        expect(axiosMatch.get).toHaveBeenCalledWith(options);
    });

    test("if provider returns categories", () => {
        const testedComponent = screen.getByTestId("test-component-categories");
        // arbitrary key - from category "Noun"
        const categoryKey = "506112ea-af69-436e-af1b-64475de40992";
        // arbitrary category title
        const categoryTitle = "Household devices";

        expect(testedComponent).toHaveTextContent(categoryKey);
        expect(testedComponent).toHaveTextContent(categoryTitle);
    });

    test("if provider returns user-selected categories", () => {
        const testedComponent = screen.getByTestId(
            "test-component-selected-categories");
        const categoryKey = "64c3df14-7117-4453-8679-42ebfd18159c";

        expect(testedComponent).toHaveTextContent(categoryKey);
    });

    test("if categories setter called the api", async () => {
        // cumulative number of all api calls in current "describe" block
        await waitFor(() => expect(axiosMatch.put).toHaveBeenCalledTimes(8));
    });
});

describe("<CardsProvider/> - memorized (general)", () => {
    const MemorizedCurrentPage = ({ currentPage }) => (
        <>
            { currentPage.map(card => (
                <p key={ card.id }
                  data-testid={ card.id }>
                  { card.grade }, { card.easiness_factor },
                  { card.last_review }, { card.introduced_on },
                </p>
            )) }
        </>
    );

    const TestingComponent = () => {
        const { currentPage, count, isFirst, isLast } = useCards().memorized;

        return (
            <>
              <span data-testid="is-first">
                { Boolean(isFirst) ? "true" : "false" }
              </span>
              <span data-testid="is-last">
                { Boolean(isLast) ? "true" : "false"}
              </span>
              <span data-testid="count">{ count }</span>
              <MemorizedCurrentPage
                data-testid="current-page"
                currentPage={currentPage}/>
            </>
        );
    };

    const card = memorizedCardsSecondPage.results[0];

    // should be: beforeAll, but gets reset to <body/>
    // after each test
    beforeEach(async () => await act(() => render(
        <ApiProvider>
          <UserProvider>
            <CategoriesProvider>
              <CardsProvider>
                <TestingComponent/>
              </CardsProvider>
            </CategoriesProvider>
          </UserProvider>
        </ApiProvider>
    )));

    test("if currentPage returned expected output", () => {
        const receivedCard = screen.getByTestId(card.id);
        expect(receivedCard).toBeInTheDocument();
    });

    test("if totalCards shows expected number of memorized cards", () => {
        const receivedCard = screen.getByTestId("count");
        expect(receivedCard).toHaveTextContent("62");
    });

    test("if isFirst correctly indicates we're not on the first page", () => {
        const isFirst = screen.getByTestId("is-first");
        expect(isFirst).toHaveTextContent("false");
    });

    test("if isLast correctly indicates we are not on the last page", () => {
        const isLast = screen.getByTestId("is-last");
        expect(isLast).toHaveTextContent("false");
    });
    /*
    test("if isFirst correctly indicates we're on the first page", () => {
        // expected output: false
    });

    test("if isLast correctly indicates that we are not yet in the last page",
         () => {
             // expected: isLast is false
         });

    test("if cards update when active categories are being updated", () => {
    });
*/
});

describe("<CardsProvider/> - memorized: navigation", () => {
    afterAll(jest.clearAllMocks);

    const TestingComponent = ({ goTo }) => {
        const { currentPage, prevPage, nextPage } = useCards().memorized;
        const calledPrev = useRef(0);
        const calledNext = useRef(0);

        switch (goTo) {
        case "next":
            nextPage();
            break;
        case "prev":
            if (currentPage !== undefined) calledPrev.current++;
            prevPage();
            break;
        default:
            throw Error("Wrong parameter: ", goTo);
        }

        return (
            <>
              <span>Parameter: { goTo }</span>
              <div data-testid="page-data">
                { currentPage.map(card => (
                    <p key={card.id} data-testid={card.id}></p>
                )) }
              </div>
            </>
        );
    };

    const ComponentWithProviders = ({ goTo }) => {
        return (<ApiProvider>
                  <UserProvider>
                    <CategoriesProvider>
                      <CardsProvider>
                        <TestingComponent goTo={ goTo }/>
                      </CardsProvider>
                    </CategoriesProvider>
                  </UserProvider>
                </ApiProvider>
               );
    };

    test("rendering next page", async () => {
        await act(() => render(
            <ComponentWithProviders goTo="next"/>
        ));
        const card = screen.getByTestId(
            "b9f2a0ec-fac1-4574-a553-26c5e8d8b5ab");
        expect(card).toBeInTheDocument();
    });

    test("rendering previous page", async () => {
        await act(() => render(
            <ComponentWithProviders goTo="prev"/>
        ));
        const card = await screen.getByTestId(
            "3dc52454-4931-4583-9737-81e6a56ac127");
        expect(card).toBeInTheDocument();
    });
});
/*
describe("<CardsProvider/> - queued (general)", () => {
    const QueuedCurrentPage = ({ currentPage }) => (
        <>
            { currentPage.map(card => (
                <p key={ card.id }
                  data-testid={ card.id }>
                  { card.grade }, { card.easiness_factor },
                  { card.last_review }, { card.introduced_on },
                </p>
            )) }
        </>
    );

    const TestingComponent = () => {
        const { currentPage, count, isFirst, isLast } = useCards().queued;

        return (
            <>
              <span data-testid="is-first">
                { Boolean(isFirst) ? "true" : "false" }
              </span>
              <span data-testid="is-last">
                { Boolean(isLast) ? "true" : "false"}
              </span>
              <span data-testid="count">{ count }</span>
              <QueuedCurrentPage
                data-testid="current-page"
                currentPage={currentPage}/>
            </>
        );
    };

    const card = queuedCardsSecondPage.results[0];

    // should be: beforeAll, but gets reset to <body/>
    // after each test
    beforeEach(async () => await act(() => render(
        <ApiProvider>
          <UserProvider>
            <CategoriesProvider>
              <CardsProvider>
                <TestingComponent/>
              </CardsProvider>
            </CategoriesProvider>
          </UserProvider>
        </ApiProvider>
    )));

    test("if currentPage returned expected output", () => {
        const receivedCard = screen.getByTestId(card.id);
        expect(receivedCard).toBeInTheDocument();
    });
});
*/
