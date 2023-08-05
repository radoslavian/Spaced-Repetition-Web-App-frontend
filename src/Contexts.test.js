import { render, act, waitFor, screen, within,
         fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { useRef, useEffect, useState } from "react";
import axios, { axiosMatch, categoriesCalls, addToCramQueue,
                downloadCards, gradeCard, forgetCard,
                getQueuedCard } from "axios";
import { UserProvider, useUser } from "./contexts/UserProvider";
import { ApiProvider, useApi } from "./contexts/ApiProvider";
import { CategoriesProvider,
         useCategories } from "./contexts/CategoriesProvider";
import { CardsProvider, useCards } from "./contexts/CardsProvider.js";
import CategorySelector from "./components/CategorySelector.js";
import { memorizedCardsSecondPage, memorizedCard,
         queuedCardsMiddlePage } from "./__mocks__/mockData";
import { getComponentWithProviders,
         LogInComponent } from "./utils/testHelpers";

describe("<ApiProvider/>", () => {
    function FakeComponent() {
        const api = useApi();
        const credentials = {user: "user_1",
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
             {"password": "passwd", "user": "user_1"},
             "headers": {"Content-Type": "application/json"},
             "method": "post",
             "url": "http://localhost:8000/api/auth/token/login/"});
    });
});

describe("<UserProvider/>", () => {
    const TestingComponent = () => {
        const { user } = useUser();

        return (
            <div>
              <p>{ user?.email }</p>
              <p>{ user?.id }</p>
              <p>{ user?.username }</p>
            </div>
        );
    };

    beforeEach(async () => await act(() => render(
        <ApiProvider>
          <LogInComponent credentials={{user: "user_1",
                                        password: "passwd"}}>
              <TestingComponent/>
            </LogInComponent>
        </ApiProvider>
    )));

    afterAll(jest.clearAllMocks);

    test("if the component returned user email", async () => {
        const userData = {
            email: "user@userdomain.com.su",
            id: "626e4d32-a52f-4c15-8f78-aacf3b69a9b2",
            username: "django_root"
        };
        const userEmail = await screen.findByText("user@userdomain.com.su");
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
    beforeEach(() => axiosMatch.put.mockClear());

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

        expect(categoriesCalls).toHaveBeenCalledTimes(1);
        expect(categoriesCalls).toHaveBeenCalledWith(options);
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
    /*
      test("if categories setter called the api", async () => {
      // fix that!
      await waitFor(() => expect(axiosMatch.put).toHaveBeenCalledTimes(4));
      });
    */
});

function getProviderGeneralTestingComponent (cardsGroup) {
    return () => {
        const { currentPage, count, isFirst, isLast } = cardsGroup;

        return (
            <>
              <span data-testid="is-first">
                { isFirst ? "true" : "false" }
              </span>
              <span data-testid="is-last">
                { isLast ? "true" : "false"}
              </span>
              <span data-testid="count">{ count }</span>
              <CardsCurrentPage
                data-testid="current-page"
                currentPage={currentPage}/>
            </>
        );
    };
}

describe("<CardsProvider/> - memorized (general)", () => {
    const TestingComponent = () => getProviderGeneralTestingComponent(
        useCards().memorized)();
    const ComponentWithProviders = getComponentWithProviders(TestingComponent);
    const card = memorizedCardsSecondPage.results[0];

    // should be: beforeAll, but gets reset to <body/>
    // after each test
    beforeEach(async () => await act(() => render(
        <ComponentWithProviders/>)));

    test("if currentPage returned expected output", () => {
        const receivedCard = screen.getByTestId(card.id);
        expect(receivedCard).toBeInTheDocument();
    });

    test("if count shows expected number of memorized cards", () => {
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
});

test("if setting categories updates <CardsProvider/>", async () => {
    const CategoriesComponent = () => {
        const { categories, selectedCategories,
                setSelectedCategories } = useCategories();
        const categoryId = "6d18daff-94d1-489b-97ce-969d1c2912a6";
        setSelectedCategories([categoryId]);
    };

    const CategoriesComponentWithProviders = getComponentWithProviders(
        CategoriesComponent);

    downloadCards.mockClear();
    render(<CategoriesComponentWithProviders/>);
    await waitFor(() => expect(
        downloadCards).toHaveBeenCalledTimes(2));
});

function getNavigationTestingComponent(cardsGroup) {
    return () => {
        const { currentPage, prevPage, nextPage, loadMore, goToFirst,
                isFirst, isLast, isLoading } = cardsGroup;

        return (
            <>
              <div data-testid="isFirst">
                { isFirst ? "true" : "false" }
              </div>
              <div data-testid="isLast">
                { isLast ? "true" : "false" }
              </div>
              { currentPage !== [] ?
                <>
                  <div data-testid="click_prevPage"
                       onClick={prevPage}>
                    Click for previous page
                  </div>
                  <div data-testid="click_nextPage"
                       onClick={nextPage}>
                    Click for next page
                  </div>
                  <div data-testid="load-more"
                       onClick={loadMore}>
                    Click to load more
                  </div>
                  <div data-testid="go-to-first"
                       onClick={goToFirst}>
                    Go to first page (reset)
                  </div>
                </>
                : "" }
              <div data-testid="page-data">
                { currentPage.map(card => (
                    <p key={card.id} data-testid={card.id}></p>
                )) }
              </div>
              <div data-testid="is-loading">
                { Boolean(isLoading) ? "true" : "false" }
              </div>
            </>
        );
    };
}

describe("<CardsProvider/> - memorized: navigation", () => {
    afterAll(jest.clearAllMocks);

    const TestingComponent = () => getNavigationTestingComponent(
        useCards().memorized)();
    const ComponentWithProviders = getComponentWithProviders(
        TestingComponent);

    test("rendering next page", async () => {
        await act(() => render(
            <ComponentWithProviders/>
        ));
        const clickNext = await screen.findByTestId("click_nextPage");
        fireEvent.click(clickNext);
        
        const card = await screen.findByTestId(
            "b9f2a0ec-fac1-4574-a553-26c5e8d8b5ab");
        expect(card).toBeInTheDocument();
    });

    test("isLoading indicator", async () => {
        await act(() => render(
            <ComponentWithProviders/>
        ));
        const loadMore = await screen.findByTestId("load-more");
        const isLoadingIndicator = await screen.findByTestId("is-loading");
        expect(isLoadingIndicator).toHaveTextContent("false");
        await act(() => {
            fireEvent.click(loadMore);
            waitFor(() => expect(isLoadingIndicator)
                    .toHaveTextContent("true"));
        });
    });

    test("load more", async () => {
        await act(() => render(
            <ComponentWithProviders/>
        ));
        const loadMore = await screen.findByTestId("load-more");
        fireEvent.click(loadMore);
        const cardMiddle = await screen.findByTestId(
            "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa");  // middle page
        const cardNext = await screen.findByTestId(
            "b9f2a0ec-fac1-4574-a553-26c5e8d8b5ab");  // next page

        // assert cards from the first and 2nd page
        expect(cardMiddle).toBeInTheDocument();
        expect(cardNext).toBeInTheDocument();
    });

    test("rendering previous page", async () => {
        await act(() => render(
            <ComponentWithProviders/>
        ));
        const clickPrev = await screen.findByTestId("click_prevPage");
        fireEvent.click(clickPrev);
        const card = await screen.findByTestId(
            "3dc52454-4931-4583-9737-81e6a56ac127");
        expect(card).toBeInTheDocument();
    });

    test("test goToFirst - returning to first page", async () => {
        await act(() => render(<ComponentWithProviders/>));
        const clickNext = await screen.findByTestId("click_nextPage");
        const cardIdFromInitialPage = "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa";
        await act(() => fireEvent.click(clickNext));
        await expect(async () => {
            await waitFor(
                () => expect(screen.getByTestId(cardIdFromInitialPage))
                    .toBeInTheDocument()
            );
        }).rejects.toEqual(expect.anything());
        const goToFirst = await screen.findByTestId("go-to-first");
        fireEvent.click(goToFirst);
        const cardFromInitialPage = await screen.findByTestId(
            cardIdFromInitialPage);
        expect(cardFromInitialPage).toBeInTheDocument();
    });
});

// move that to the top
const CardsCurrentPage = ({ currentPage }) => (
    <>
      { currentPage.map(card => (
          <p key={ card.id }
             data-testid={ card.id }>
          </p>
      )) }
    </>
);

describe("<CardsProvider/> - queued (general)", () => {
    const TestingComponent = () => getProviderGeneralTestingComponent(
        useCards().queued)();
    const card = queuedCardsMiddlePage.results[0];
    const ComponentWithProviders = getComponentWithProviders(
        TestingComponent);

    // should be: beforeAll instead, but gets reset to <body/>
    // after each test
    beforeEach(async () => await act(() => render(
        <ComponentWithProviders/>)));

    test("if currentPage returned expected output", () => {
        const receivedCard = screen.getByTestId(card.id);
        expect(receivedCard).toBeInTheDocument();
    });

    test("if count shows expected number of queued cards", () => {
        const receivedCard = screen.getByTestId("count");
        expect(receivedCard).toHaveTextContent("60");
    });

    test("if isFirst correctly indicates we're not on the first page", () => {
        const isFirst = screen.getByTestId("is-first");
        expect(isFirst).toHaveTextContent("false");
    });

    test("if isLast correctly indicates we are not on the last page", () => {
        const isLast = screen.getByTestId("is-last");
        expect(isLast).toHaveTextContent("false");
    });
});

describe("<CardsProvider/> - queued: navigation", () => {
    afterAll(jest.clearAllMocks);

    const QueuedTestingComponent = () => getNavigationTestingComponent(
        useCards().queued)();
    const ComponentWithProviders = getComponentWithProviders(
        QueuedTestingComponent);

    beforeEach(async () => await act(() => render(
        <ComponentWithProviders/>
    )));

    test("rendering next page", async () => {
        const clickNext = await screen.findByTestId("click_nextPage");
        fireEvent.click(clickNext);
        const card = await screen.findByTestId(
            "5cd3446f-0b68-4224-8bb8-f04fe4ed83cb");
        expect(card).toBeInTheDocument();
    });

    test("isLoading indicator", async () => {
        const loadMore = await screen.findByTestId("load-more");
        const isLoadingIndicator = await screen.findByTestId("is-loading");
        expect(isLoadingIndicator).toHaveTextContent("false");
        await act(() => {
            fireEvent.click(loadMore);
            waitFor(() => expect(isLoadingIndicator)
                    .toHaveTextContent("true"));
        });
    });

    test("rendering previous page", async () => {
        const clickPrev = await screen.findByTestId("click_prevPage");
        fireEvent.click(clickPrev);
        const card = await screen.findByTestId(
            "f4055d8c-c97f-419f-b6db-61d36f53da47");
        expect(card).toBeInTheDocument();
    });

    test("isFirst should be false", async () => {
        const isFirstValue = await screen.findByTestId("isFirst");
        expect(isFirstValue).toHaveTextContent("false");
    });

    test("isFirst should be true", async () => {
        const clickPrev = await screen.findByTestId("click_prevPage");
        fireEvent.click(clickPrev);
        const isFirstValue = await screen.findByTestId("isFirst");
        await waitFor(() => expect(isFirstValue).toHaveTextContent("true"));
    });

    test("isLast should be false", async () => {
        const isLastValue = await screen.findByTestId("isLast");
        await waitFor(() => expect(isLastValue).toHaveTextContent("false"));
    });

    test("isLast should be true", async () => {
        const clickNext = await screen.findByTestId("click_nextPage");
        fireEvent.click(clickNext);
        const isLastValue = await screen.findByTestId("isLast");
        await waitFor(() => expect(isLastValue).toHaveTextContent("true"));
    });

    test("goToFirst - returning to the first page", async () => {
        const clickNext = await screen.findByTestId("click_nextPage");
        const cardIdFromInitialPage = "4a58594b-1c84-41f5-b4f0-72dc573b6406";
        await act(() => fireEvent.click(clickNext));
        await expect(async () => {
            await waitFor(
                () => expect(screen.getByTestId(cardIdFromInitialPage))
                    .toBeInTheDocument()
            );
        }).rejects.toEqual(expect.anything());
        const goToFirst = await screen.findByTestId("go-to-first");
        fireEvent.click(goToFirst);
        const cardFromInitialPage = await screen.findByTestId(
            cardIdFromInitialPage);
        expect(cardFromInitialPage).toBeInTheDocument();
    });

    test("load more", async () => {
        const loadMore = await screen.findByTestId("load-more");
        fireEvent.click(loadMore);
        const cardMiddle = await screen.findByTestId(
            "4a58594b-1c84-41f5-b4f0-72dc573b6406");  // middle page
        const cardNext = await screen.findByTestId(
            "5cd3446f-0b68-4224-8bb8-f04fe4ed83cb");  // next page

        // assert cards from the first and 2nd page
        expect(cardMiddle).toBeInTheDocument();
        expect(cardNext).toBeInTheDocument();
    });
});

describe("<CardsProvider/> - outstanding (scheduled) - general", () => {
    const TestingComponent = () => getProviderGeneralTestingComponent(
        useCards().outstanding)();
    const ComponentWithProviders = getComponentWithProviders(
        TestingComponent);

    beforeEach(async () => await act(() => render(
        <ComponentWithProviders/>)));

    test("if currentPage returned expected output", () => {
        const receivedCard = screen.getByTestId(
            "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa");
        expect(receivedCard).toBeInTheDocument();
    });

    test("if count shows expected number of outstanding cards", () => {
        const receivedCard = screen.getByTestId("count");
        expect(receivedCard).toHaveTextContent("3");
    });

    test("if isFirst correctly indicates we're not on the first page", () => {
        const isFirst = screen.getByTestId("is-first");
        expect(isFirst).toHaveTextContent("false");
    });

    test("if isLast correctly indicates we are not on the last page", () => {
        const isLast = screen.getByTestId("is-last");
        expect(isLast).toHaveTextContent("false");
    });
});

describe("<CardsProvider/> - outstanding (scheduled) - navigation", () => {
    const QueuedTestingComponent = () => getNavigationTestingComponent(
        useCards().outstanding)();
    const ComponentWithProviders = getComponentWithProviders(
        QueuedTestingComponent);

    beforeEach(async () => await act(() => render(
        <ComponentWithProviders/>
    )));

    test("load more", async () => {
        const loadMore = await screen.findByTestId("load-more");
        fireEvent.click(loadMore);
        const cardMiddle = await screen.findByTestId(
            "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa");  // middle page
        const cardNext = await screen.findByTestId(
            "c6168ba7-6eac-4e1c-806b-3ce111bcdec3");  // next page

        // assert cards from the first and 2nd page
        expect(cardMiddle).toBeInTheDocument();
        expect(cardNext).toBeInTheDocument();
    });

    test("goToFirst - reseting and returning to the first page", async () => {
        const loadMore = await screen.findByTestId("load-more");
        const goToFirst = await screen.findByTestId("go-to-first");
        await act(() => fireEvent.click(loadMore));
        await act(() => fireEvent.click(goToFirst));

        await expect(async () => {
            await waitFor(
                () => expect(screen.getByTestId(
                    "c6168ba7-6eac-4e1c-806b-3ce111bcdec3"))
                    .toBeInTheDocument()
            );
        }).rejects.toEqual(expect.anything());
    });

    test("rendering next page", async () => {
        const clickNext = await screen.findByTestId("click_nextPage");
        fireEvent.click(clickNext);
        const card = await screen.findByTestId(
            "c6168ba7-6eac-4e1c-806b-3ce111bcdec3");
        expect(card).toBeInTheDocument();
    });

    test("rendering previous page", async () => {
        const clickPrev = await screen.findByTestId("click_prevPage");
        fireEvent.click(clickPrev);
        const card = await screen.findByTestId(
            "91d1ef25-b1c8-4c49-8b00-215f90088232");
        expect(card).toBeInTheDocument();
    });

    test("isLoading indicator", async () => {
        const loadMore = await screen.findByTestId("load-more");
        const isLoadingIndicator = await screen.findByTestId("is-loading");
        expect(isLoadingIndicator).toHaveTextContent("false");
        await act(() => {
            fireEvent.click(loadMore);
            waitFor(() => expect(isLoadingIndicator)
                    .toHaveTextContent("true"));
        });
    });
});

describe("<CardsProvider/> - all cards - general", () => {
    const TestingComponent = () => getProviderGeneralTestingComponent(
        useCards().all)();
    const ComponentWithProviders = getComponentWithProviders(
        TestingComponent);

    beforeEach(async () => await act(() => render(
        <ComponentWithProviders/>)));

    test("if currentPage returned expected output", () => {
        // data: allCardsMiddle
        const receivedCard = screen.getByTestId(
            "f8f3ef31-1554-450f-ad7b-589bfd0e068d");  // memorized
        expect(receivedCard).toBeInTheDocument();
    });

    test("if count shows expected number of outstanding cards", () => {
        const receivedCard = screen.getByTestId("count");
        expect(receivedCard).toHaveTextContent("122");
    });

    test("if isFirst correctly indicates we're not on the first page",
         async () => {
             const isFirst = await screen.findByTestId("is-first");
             expect(isFirst).toHaveTextContent("false");
         });

    test("if isLast correctly indicates we are not on the last page",
         () => {
             const isLast = screen.getByTestId("is-last");
             expect(isLast).toHaveTextContent("false");
         });
});

describe("<CardsProvider/> - all cards - navigation", () => {
    const QueuedTestingComponent = () => getNavigationTestingComponent(
        useCards().all)();
    const ComponentWithProviders = getComponentWithProviders(
        QueuedTestingComponent);

    test("isLoading indicator", async () => {
        await act(() => render(<ComponentWithProviders/>));
        const loadMore = await screen.findByTestId("load-more");
        const isLoadingIndicator = await screen.findByTestId("is-loading");
        expect(isLoadingIndicator).toHaveTextContent("false");
        fireEvent.click(loadMore);
        await waitFor(() => expect(isLoadingIndicator)
                      .toHaveTextContent("true"));
    });

    test("rendering next page", async () => {
        await act(() => render(<ComponentWithProviders/>));
        const clickNext = await screen.findByTestId("click_nextPage");
        fireEvent.click(clickNext);
        const card = await screen.findByTestId(
            "f4055d8c-c97f-419f-b6db-62d36f53da47");
        expect(card).toBeInTheDocument();
    });

    test("rendering previous page", async () => {
        await act(() => render(<ComponentWithProviders/>));
        const clickPrev = await screen.findByTestId("click_prevPage");
        fireEvent.click(clickPrev);
        const card = await screen.findByTestId(
            "5cd3446f-0b68-4224-8bb8-f04fe4ed83cb");
        expect(card).toBeInTheDocument();
    });

    test("load more", async () => {
        // currentPage, after hitting loadMore, shows items from the first
        // and second page
        await act(() => render(<ComponentWithProviders/>));
        const loadMore = await screen.findByTestId("load-more");
        fireEvent.click(loadMore);
        const cardMiddle = await screen.findByTestId(
            "f8f3ef31-1554-450f-ad7b-589bfd0e068d");  // allCardsMiddle
        const cardNext = await screen.findByTestId(
            "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa");  // allCardsNext

        // assert cards from the first and 2nd page
        expect(cardMiddle).toBeInTheDocument();
        expect(cardNext).toBeInTheDocument();
    });

    test("goToFirst - reseting and returning to the first page", async () => {
        await act(() => render(<ComponentWithProviders/>));
        const loadMore = await screen.findByTestId("load-more");
        const goToFirst = await screen.findByTestId("go-to-first");
        await act(() => fireEvent.click(loadMore));
        await act(() => fireEvent.click(goToFirst));

        // StackOverflow recipe:
        // https://stackoverflow.com/questions/68400489/how-to-wait-to-assert
        // -an-element-never-appears-in-the-document
        await expect(async () => {
            await waitFor(
                () => expect(screen.getByTestId(
                    "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa"))
                    .toBeInTheDocument()
            );
        }).rejects.toEqual(expect.anything());        
    });
});

describe("<CardsProvider/> - forgetting cards", () => {
    function Component() {
        const cards = useCards();
        const { memorized, outstanding, queued, cram, all } = cards;
        const { forget } = cards.functions;

        return (
            <>
              <div data-testid="memorized-cards">
                { memorized.currentPage.map(
                    card => <span key={card.id}
                                  data-testid={card.id}
                                  onClick={() => forget(card)}/>
                ) }
              </div>
              <div data-testid="outstanding-cards">
                { outstanding.currentPage.map(
                    card => <span key={card.id}
                                  data-testid={card.id}/>
                ) }
              </div>
              <div data-testid="all-cards">
                { all.currentPage.map(
                    card => <span key={card.id}
                                  data-testid={card.id}>
                              { card.type }
                            </span>
                ) }
              </div>
              <div data-testid="crammed-cards">
                { cram.currentPage.map(
                    card => <span key={card.id}
                                  data-testid={card.id}>
                              { card.type }
                            </span>
                ) }
              </div>
              <div data-testid="queued-cards">
                { queued.currentPage.map(
                    card => <span key={card.id}
                                  data-testid={card.id}
                                  onClick={() => forget(card)}/>
                ) }
              </div>
              <span data-testid="number-of-memorized-cards">
                { memorized.count }
              </span>
              <span data-testid="number-of-queued-cards">
                { queued.count }
              </span>
              <span data-testid="number-of-crammed-cards">
                { cram.count }
              </span>
              <span data-testid="number-of-outstanding-cards">
                { outstanding.count }
              </span>
            </>
        );
    }

    beforeAll(() => jest.spyOn(global.console, "error"));

    // should I clear screen after each test?
    beforeEach(() => render(
        <ApiProvider>
          <LogInComponent credentials={{user: "user_1",
                                        password: "passwd"}}>
              <Component/>
            </LogInComponent>
        </ApiProvider>
    ));

    const getForgetter = cardsListId => async cardId => {
        // must be called with await - otherwise will raise
        // the "The current testing environment is not configured to
        // support act(...)" message !!!

        const cardsList = await screen.findByTestId(cardsListId);
        const card = await within(cardsList).findByTestId(cardId);
        fireEvent.click(card);
        return card;
    };

    const forgetMemorizedCard = getForgetter("memorized-cards");
    const forgetQueuedCard = getForgetter("queued-cards");

    test("FAILURE: card not found", async () => {
        const cardId = "4a58594b-1c84-41f5-b4f0-72dc573b6406";
        const errorMessage = "not found";
        const memorizedCount = await screen.findByTestId(
            "number-of-memorized-cards");
        const queuedCount = await screen.findByTestId(
            "number-of-queued-cards");
        console.error.mockClear();
        await forgetQueuedCard(cardId);

        await waitFor(() => expect(console.error).toBeCalled());
        // expect(console.error).toHaveBeenCalledWith(errorMessage);

        // doesn't decrease memorized count
        await expect(async () => {
            await waitFor(
                () => expect(memorizedCount).toHaveTextContent(61));
        }).rejects.toEqual(expect.anything());

        // doesn't increase queued count
        await expect(async () => {
            await waitFor(
                () => expect(queuedCount).toHaveTextContent(61));
        }).rejects.toEqual(expect.anything());
    });

    it("doesn't decrease outstanding cards count by 1", async () => {
        // uses function for returning tomorrow's date (in mockData.js)
        // to get future review date for a card
        // mocking date seems to be a better solution

        // this card is scheduled for tomorrow
        const cardId = "5949947a-92ad-4e10-94dc-51c7da11c6e8";
        const outstandingCount = await screen.findByTestId(
            "number-of-outstanding-cards");
        await forgetMemorizedCard(cardId);

        await expect(async () => {
            await waitFor(
                () => expect(outstandingCount).toHaveTextContent(2));
        }).rejects.toEqual(expect.anything());
    });

    it("decreases outstanding cards count by 1", async () => {
        // forgetting scheduled card
        // this card is scheduled for 2023-05-11
        const cardId = "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa";
        const outstandingCards = await screen.findByTestId(
            "outstanding-cards");
        const scheduledCard = await within(outstandingCards).findByTestId(cardId);
        const outstandingCount = await screen.findByTestId(
            "number-of-outstanding-cards");
        await forgetMemorizedCard(cardId);

        // following forgetting, the card is removed from
        // the current page of outstanding cards
        await waitFor(() => {
            expect(scheduledCard).not.toBeInTheDocument();
            expect(outstandingCount).toHaveTextContent(2);
        });
    });

    test("card swapping on the list of all cards", async () => {
        // 1. the card is on the list of memorized cards and all cards
        // 2. forget the card on the list of memorized
        // 3. card on the list of all cards changes status to queued

        // this card is "memorized" on all-cards
        const cardId = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        const allCardsList = await screen.findByTestId("all-cards");
        const card = await within(allCardsList).findByTestId(cardId);
        await forgetMemorizedCard(cardId);

        await waitFor(() => expect(card).toHaveTextContent("queued"));
    });

    it("doesn't get the queued card", async () => {
        // ... if it isn't on the current page of all-cards list
        getQueuedCard.mockClear();
        // this card isn't on the first page of the all-cards list
        // (though it is on its second page)
        const cardId = "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa";
        await forgetMemorizedCard(cardId);

        // i.e. must be called 0 times
        await expect(async () => await waitFor(
            () => expect(getQueuedCard).toHaveBeenCalledTimes(1)
            // how to make this one work?
            // () => expect(getQueuedCard.calls).toBeGreaterThan(0)
        )).rejects.toEqual(expect.anything());
    });

    it("gets the queued card if it is on the all-cards list", async () => {
        // downloads the card if it is on the current page of
        // the all-cards list
        getQueuedCard.mockClear();
        // this card is on the list of all cards
        const cardId = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        // const userId = ...
        await forgetMemorizedCard(cardId);
        const getQueuedCardUrl = "http://localhost:8000/api/users/626e4d32-a5"
              + `2f-4c15-8f78-aacf3b69a9b2/cards/queued/${cardId}`;

        await waitFor(() => {
            expect(getQueuedCard).toHaveBeenCalledTimes(1);
            expect(getQueuedCard).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: getQueuedCardUrl,
                    method: "get"
                }));
        });
    });

    test("if number of crammed cards is decreased by 1", async () => {
        // this card has the cram-link
        const cardId = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        await forgetMemorizedCard(cardId);
        const numberOfCrammedCards = await screen.findByTestId(
            "number-of-crammed-cards");

        await waitFor(() => expect(
            numberOfCrammedCards).toHaveTextContent(61));
    });

    test("if number of crammed cards isn't decreased by 1", async () => {
        // for cards that aren't crammed
        // this card doesn't have a cram-link
        const cardId = "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa";
        await forgetMemorizedCard(cardId);
        const numberOfCrammedCards = await screen.findByTestId(
            "number-of-crammed-cards");

        await expect(async () => {
            await waitFor(
                // maybe better: not.toHave...(62)?
                () => expect(numberOfCrammedCards).toHaveTextContent(61));
        }).rejects.toEqual(expect.anything());
    });

    test("if card is removed from the cram list", async () => {
        const cardId = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        const crammedCards = await screen.getByTestId("crammed-cards");
        const card = await within(crammedCards).findByTestId(cardId);
        await forgetMemorizedCard(cardId);

        await waitFor(() => expect(card).not.toBeInTheDocument());
    });

    test("if number of queued cards is increased by one", async () => {
        const cardId = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        const numberOfQueuedCards = await screen.findByTestId(
            "number-of-queued-cards");
        await forgetMemorizedCard(cardId);

        await waitFor(() => expect(numberOfQueuedCards)
                      .toHaveTextContent("61"));
    });

    test("if number of memorized cards is decreased by one", async () => {
        const cardId = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        await forgetMemorizedCard(cardId);
        const numberOfMemorizedCards = await screen.findByTestId(
            "number-of-memorized-cards");

        // mockData.memorizedCardsSecondPage.count
        await waitFor(() => expect(numberOfMemorizedCards)
                      .toHaveTextContent("61"));
    });

    test("the card is removed from the list of memorized cards", async () => {
        const cardId = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        const memorizedCard = await forgetMemorizedCard(cardId);
        await waitFor(() => expect(memorizedCard).not.toBeInTheDocument());
    });

    test("calling forgetting route", async () => {
        const forgettingRoute = "http://localhost:8000/api/users/626e4d32-a5"
              + "2f-4c15-8f78-aacf3b69a9b2/cards/memorized/5b457c11-b751-436c"
              + "-9cfe-f3f4d173c1ba";
        const cardId = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        await forgetMemorizedCard(cardId);

        expect(forgetCard).toHaveBeenCalledWith(
            expect.objectContaining({
                url: forgettingRoute,
                method: "delete"
            }));
    });
});

describe("<CardsProvider/> - memorizing cards", () => {
    function FunctionsTestingComponent() {
        const cards = useCards();
        const { memorize } = cards.functions;
        const { user } = useUser();
        const grade = 2;

        return (
            <>
             {
                 user !== undefined ?
                     <span onClick={ () => memorize(memorizedCard, grade) }
                           data-testid="click-memorize-card">
                       Click to memorize card
                     </span> : <span/>
             }
           </>
        );
    }
    
    const ComponentWithProviders = getComponentWithProviders(
        FunctionsTestingComponent);

    test("memorizing queued card", async () => {
        render(<ComponentWithProviders/>);
        const memorize = await screen.findByTestId("click-memorize-card");
        const expectedUrl = "http://localhost:8000/api/users/626e4d32-a5"
              + "2f-4c15-8f78-aacf3b69a9b2/cards/queued/5f143904-c9d1-4e5b"
              + "-ac00-01258d09965a";
        const expectedGrade = 2;

        await act(() => fireEvent.click(memorize));
        await waitFor(() => expect(
            axiosMatch.patch).toHaveBeenCalledTimes(1));
        const mockCalls = axiosMatch.patch.mock.calls[0][0];
        expect(mockCalls.url).toEqual(expectedUrl);
        expect(mockCalls.data.grade).toEqual(expectedGrade);
    });

    function MemorizedCardsTestComponent() {
        // Component for testing memorized cards and functions

        const cards = useCards();
        const { memorize } = cards.functions;
        const { memorized, queued } = cards;

        const grade = 2;

        return (
            <>
              <div data-testid="queued-cards">
                { cards.queued.currentPage.map(
                    card => <span
                key={card.id}
                data-testid={card.id}
                onClick={() => memorize(card)}/>
                ) }
              </div>
              <div data-testid="all-cards">
                { cards.all.currentPage.map(
                    card => <span
                                   key={card.id}
                                   data-testid={card.id}
                                   onClick={() => memorize(card)}>
                                {card.type}
                              </span>
                ) }
              </div>
              <div data-testid="memorized-cards">
                { cards.memorized.currentPage.map(
                    card => <span
                              key={card.id}
                              data-testid={card.id}>
                              {card.type}
                            </span>
                ) }
              </div>
              <span data-testid="queued-cards-count">
                { queued.count }
              </span>
              <span data-testid="memorized-cards-count">
                { memorized.count }
              </span>
            </>
        );
    }

    const MemorizedCardsWithProviders = getComponentWithProviders(
        MemorizedCardsTestComponent);

    test("if memorized card is removed from queued cards list", async () => {
        await act(() => render(<MemorizedCardsWithProviders/>));
        const queuedCards = screen.getByTestId("queued-cards");
        const queuedCard = await within(queuedCards).findByTestId(
            "5f143904-c9d1-4e5b-ac00-01258d09965a");
        expect(queuedCard).toBeInTheDocument();
        fireEvent.click(queuedCard);

        await waitForElementToBeRemoved(() => within(
            queuedCards).queryByTestId(
                "5f143904-c9d1-4e5b-ac00-01258d09965a"));
        const remainingQueuedCard = await screen.findByTestId(
            "4a58594b-1c84-41f5-b4f0-72dc573b6406");
        expect(remainingQueuedCard).toBeInTheDocument();
    });

    test("if queued.count decreases by 1", async () => {
        render(<MemorizedCardsWithProviders/>);
        const queuedCount = await screen.findByTestId("queued-cards-count");
        const queuedCards = screen.getByTestId("queued-cards");
        const queuedCard = await within(queuedCards).findByTestId(
            "5f143904-c9d1-4e5b-ac00-01258d09965a");
        fireEvent.click(queuedCard);

        await waitFor(() => expect(queuedCount).toHaveTextContent(59));
    });

    test("if memorized.count increases by 1", async () => {
        render(<MemorizedCardsWithProviders/>);
        const memorizedCount = await screen.findByTestId(
            "memorized-cards-count");
        const queuedCards = screen.getByTestId("queued-cards");
        const queuedCard = await within(queuedCards).findByTestId(
            "5f143904-c9d1-4e5b-ac00-01258d09965a");
        fireEvent.click(queuedCard);

        await waitFor(() => expect(memorizedCount).toHaveTextContent(63));
    });

    test("if memorized card is swapped on the list of all cards",
         async () => {
             // after memorizing, the card (if it is displayed on
             // the current page
             // of all cards list) should change status - from
             // "queued" to "memorized"
             render(<MemorizedCardsWithProviders/>);
             const allCards = screen.getByTestId("all-cards");
             const card = await within(allCards)
                   .findByTestId("5f143904-c9d1-4e5b-ac00-01258d09965a");
             expect(card).toHaveTextContent("queued");
             await act(() => fireEvent.click(card));
             // text-content change after memorization:
             expect(card).toHaveTextContent("memorized");
         });

    test("if memorized card appeared on the list of memorized cards",
         async () => {
             render(<MemorizedCardsWithProviders/>);
             const allCards = screen.getByTestId("all-cards");
             const card = await within(allCards)
                   .findByTestId("5f143904-c9d1-4e5b-ac00-01258d09965a");
             // memorize card
             await act(() => fireEvent.click(card));
             const memorizedCards = screen.getByTestId("memorized-cards");
             const memorizedCard = await within(memorizedCards)
                   .findByTestId("5f143904-c9d1-4e5b-ac00-01258d09965a");
             expect(memorizedCard).toBeInTheDocument();
         });

    test("if cards from other lists are not present in memorizedCards",
         async () => {
             render(<MemorizedCardsWithProviders/>);
             const allCards = screen.getByTestId("all-cards");
             const memorizedCards = screen.getByTestId("memorized-cards");
             const cardFromCramId = "1a5c7caf-fe7d-4b14-a022-91d9b52a36a0";
             const cardFromQueuedId = "4a58594b-1c84-41f5-b4f0-72dc573b6406";
             const cardFromCram = await within(memorizedCards)
                   .queryByTestId(cardFromCramId);
             const cardFromQueue = await within(memorizedCards)
                   .queryByTestId(cardFromQueuedId);
             // memorize card
             const card = await within(allCards)
                   .findByTestId("5f143904-c9d1-4e5b-ac00-01258d09965a");
             await act(() => fireEvent.click(card));
             await expect(async () => {
                 await waitFor(
                     () => {
                         expect(cardFromCram).toBeInTheDocument();
                         expect(cardFromQueue).toBeInTheDocument();
                     });
             }).rejects.toEqual(expect.anything());
         });
});

import { cramQueueSecondPage } from "./__mocks__/mockData";

describe("<CardsProvider/> - queued (general)", () => {
    const TestingComponent = () => getProviderGeneralTestingComponent(
        useCards().cram)();
    const card = cramQueueSecondPage.results[0];
    const ComponentWithProviders = getComponentWithProviders(
        TestingComponent);

    // should be: beforeAll instead, but gets reset to <body/>
    // after each test
    beforeEach(async () => await act(() => render(
        <ComponentWithProviders/>)));

    test("if currentPage returned expected output", () => {
        const receivedCard = screen.getByTestId(card.id);
        expect(receivedCard).toBeInTheDocument();
    });

    test("if count shows expected number of queued cards", () => {
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
});


describe("<CardsProvider/> - cram: navigation", () => {
    afterAll(jest.clearAllMocks);

    const TestingComponent = () => getNavigationTestingComponent(
        useCards().cram)();
    const ComponentWithProviders = getComponentWithProviders(
        TestingComponent);

    test("rendering next page", async () => {
        await act(() => render(
            <ComponentWithProviders/>
        ));
        const clickNext = await screen.findByTestId("click_nextPage");
        fireEvent.click(clickNext);
        
        const card = await screen.findByTestId(
            "c9f2a0ec-fac1-4573-a553-26c5e8d8b5ab");
        expect(card).toBeInTheDocument();
    });

    test("load more", async () => {
        await act(() => render(
            <ComponentWithProviders/>
        ));
        const loadMore = await screen.findByTestId("load-more");
        fireEvent.click(loadMore);
        const cardMiddle = await screen.findByTestId(
            "7cf7ed26-bfd3-45z8-a9fc-a284a86a6bfa");  // middle page
        const cardNext = await screen.findByTestId(
            "c9f2a0ec-fac1-4573-a553-26c5e8d8b5ab");  // next page

        // assert cards from the first and 2nd page
        expect(cardMiddle).toBeInTheDocument();
        expect(cardNext).toBeInTheDocument();
    });

    test("rendering previous page", async () => {
        await act(() => render(<ComponentWithProviders/>));
        const clickPrev = await screen.findByTestId("click_prevPage");
        fireEvent.click(clickPrev);
        const card = await screen.findByTestId(
            "3dc52454-4131-4583-9737-81j6a56ac127");
        expect(card).toBeInTheDocument();
    });

    test("goToFirst - reseting and returning to the first page", async () => {
        await act(() => render(<ComponentWithProviders/>));
        const loadMore = await screen.findByTestId("load-more");
        const goToFirst = await screen.findByTestId("go-to-first");
        await act(() => fireEvent.click(loadMore));
        await act(() => fireEvent.click(goToFirst));

        // StackOverflow recipe:
        // https://stackoverflow.com/questions/68400489/how-to-wait-to-assert
        // -an-element-never-appears-in-the-document
        await expect(async () => {
            await waitFor(
                () => expect(screen.getByTestId(
                    "c9f2a0ec-fac1-4573-a553-26c5e8d8b5ab"))
                    .toBeInTheDocument()
            );
        }).rejects.toEqual(expect.anything());
    });
});

describe("<CardsProvider/> - cram queue", () => {
    const CramTestingComponent = () => {
        const cards = useCards();
        const { cram, reviewCrammed, memorize } = cards.functions;
        const memorized = cards.memorized;
        const allCards = cards.all;
        const cramQueue = cards.cram;

        return (
            <>
              <div data-testid="memorized-cards">
                { memorized.currentPage.map(
                    card => <span key={card.id}
                                  data-testid={card.id}
                                  onClick={() => cram(card)}
                            >
                              {card.cram_link}
                            </span>)}
              </div>
              <div data-testid="all-cards">
                { allCards.currentPage.map(
                    card => <span key={card.id}
                                  data-testid={card.id}
                                  onClick={() => cram(card)}
                            >
                              {card.cram_link}
                            </span>)}
              </div>
              <div data-testid="queued-cards">
                { cards.queued.currentPage.map(
                    card => <span key={card.id}
                                  data-testid={card.id}
                                  onClick={() => memorize(card, 2)}
                            />)}
              </div>
              <div data-testid="cram-list">
                { cramQueue.currentPage.map(
                    card => <span key={card.id}
                                  data-testid={card.id}
                                  onClick={() => reviewCrammed(card, 5)}
                            >
                              {card.cram_link}
                            </span>)}
              </div>
              <span data-testid="cram-count">
                {cramQueue.count}
              </span>
            </>
        );
    };

    const CramComponentWithProviders = getComponentWithProviders(
        CramTestingComponent);

    test("grading queued card < 4 increases cram count by 1", async () => {
        render(<CramComponentWithProviders/>);
        const cramCount = screen.getByTestId("cram-count");
        const queuedCardId = "5f143904-c9d1-4e5b-ac00-01258d09965a";
        const queuedCards = screen.getByTestId("queued-cards");
        const queuedCard = await within(queuedCards)
              .findByTestId(queuedCardId);
        fireEvent.click(queuedCard);
        await waitFor(() => expect(cramCount).toHaveTextContent(63));
    });

    test("crammed card graded > 3 has the cram link dropped", async () => {
        // test both all and memorized cards
        render(<CramComponentWithProviders/>);
        // get list of memorized cards
        // select card 5b457c11-b751-436c-9cfe-f3f4d173c1ba (findBy...)
        // in memorized
        // get cram-list
        // review card 5b457c11-b751-436c-9cfe-f3f4d173c1ba in cram list
        const cramLink = "/api/users/7cfaec0a-0cc6-4249-8240-b52e40b4da7a/"
        + "cards/cram-queue/5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        const cardById = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        const memorizedCards = await screen.findByTestId("memorized-cards");
        const memorizedCard = await within(memorizedCards)
              .findByTestId(cardById);
        const allCards = await screen.findByTestId("all-cards");
        const cardInAllCards = await within(allCards).findByTestId(cardById);
        const cramList = await screen.findByTestId("cram-list");
        const memorizedCardInCram = await within(cramList)
              .findByTestId(cardById);

        expect(memorizedCardInCram).toHaveTextContent(cramLink);
        fireEvent.click(memorizedCardInCram);
        await waitFor(() => expect(memorizedCard)
                      .not.toHaveTextContent(cramLink));
        await waitFor(() => expect(cardInAllCards)
                      .not.toHaveTextContent(cramLink));
    });

    test("adding memorized card to cram queue", async () => {
        render(<CramComponentWithProviders/>);
        const crammedCardId = "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa";
        const memorizedCards = screen.getByTestId("memorized-cards");
        const crammedCards = screen.getByTestId("cram-list");
        const memorizedCard = await within(memorizedCards)
              .findByTestId(crammedCardId);
        fireEvent.click(memorizedCard);
        const crammedCard = await within(crammedCards)
              .findByTestId(crammedCardId);
        const cramCount = screen.getByTestId("cram-count");

        expect(axiosMatch.put).toHaveBeenCalledTimes(1);
        expect(crammedCard).toBeInTheDocument();
        expect(axiosMatch.put).toHaveBeenCalledWith(
            expect.objectContaining(
                {data: {"card_pk": "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa"}}));
        // cram count is increased by 1:
        await waitFor(() => expect(cramCount).toHaveTextContent(63));
    });

    test("adding to the cram a card that has a cram link", async () => {
        render(<CramComponentWithProviders/>);
        axiosMatch.put.mockClear();

        const cardInCramId = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        const memorizedCards = screen.getByTestId("memorized-cards");
        const crammedCards = screen.getByTestId("cram-list");
        const memorizedCardInCram = await within(memorizedCards)
              .findByTestId(cardInCramId);
        fireEvent.click(memorizedCardInCram);
        const cramCount = screen.getByTestId("cram-count");

        expect(axiosMatch.put).not.toHaveBeenCalled();
        await expect(async () => {
            await waitFor(
                // cram count IS NOT increased by 1
                () => expect(cramCount).toHaveTextContent("63")
            );
        }).rejects.toEqual(expect.anything());
    });

    test("removing card from the cram", async () => {
        await act(() => render(<CramComponentWithProviders/>));
        const crammedCardId = "7cf7ed26-bfd3-45z8-a9fc-a284a86a6bfa";
        const crammedCard = await screen.findByTestId(crammedCardId);
        fireEvent.click(crammedCard);
        await waitFor(() => expect(crammedCard).not.toBeInTheDocument());
    });
});

describe("<CardsProvider/> - card grading", () => {
    beforeAll(() => jest.spyOn(global.console, "error"));

    const GradingTestComponent = (cardGrade) => {
        const cards = useCards();
        const { outstanding } = cards;
        const { grade } = cards.functions;
        const cramQueue = cards.cram;

        return (
            <>
              <div data-testid="outstanding-cards">
                { outstanding.currentPage.map(
                    card => <span data-testid={ card.id }
                            key={ card.id }
                            onClick={ () => grade(card, cardGrade) }/>) }
              </div>
              <div data-testid="cram-queue">
                { cramQueue.currentPage.map(
                    card => <span data-testid={ card.id }
                                  key={ card.id }/>) }
              </div>
              <span data-testid="outstanding-count">
                { outstanding.count }
              </span>
              <span data-testid="cram-count">
                { cramQueue.count }
              </span>
            </>
        );
    };

    test("grade > 3", async () => {
        const GradingTestWithProviders = getComponentWithProviders(
            () => GradingTestComponent(4));
        await act(async () => await render(<GradingTestWithProviders/>));

        const card = await screen.findByTestId(
            "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa");
        const cramQueue = await screen.findByTestId("cram-queue");
        const outstandingCount = await screen.findByTestId(
            "outstanding-count");
        const cramCount = await screen.findByTestId("cram-count");
        const expectedUrl = "http://localhost:8000/api/users/626e4d32-a52f-4c"
              + "15-8f78-aacf3b69a9b2/cards/memorized/7cf7ed26-bfd2-4"
              + "5a8-a9fc-a284a86a6bfa";
        fireEvent.click(card);

        expect(gradeCard).toHaveBeenCalledTimes(1);
        expect(gradeCard).toHaveBeenCalledWith(
            expect.objectContaining({
                url: expectedUrl,
                method: "patch",
                data: { grade: 4 }
            }));
        // card disapears from the outstanding list
        await waitFor(() => expect(card).not.toBeInTheDocument());
        // cards with grade > 3 don't appear on the cram queue list
        const cardInCram = within(cramQueue).queryByTestId(
            "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa");
        expect(cardInCram).not.toBeInTheDocument();
        // number of outstanding cards is decreased by 1
        expect(outstandingCount).toHaveTextContent(2);
        // cram-count doesn't change
        expect(cramCount).toHaveTextContent("62");
    });

    test("grade < 4", async () => {
        const cardId = "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa";
        const GradingTestWithProviders = getComponentWithProviders(
            () => GradingTestComponent(3));
        await act(async () => await render(<GradingTestWithProviders/>));

        const cramCount = await screen.findByTestId("cram-count");
        const outstandingCards = await screen.findByTestId(
            "outstanding-cards");
        const card = await within(outstandingCards).findByTestId(cardId);
        const cramQueue = await screen.findByTestId("cram-queue");
        fireEvent.click(card);

        // cards with grade < 4 should be added to the cram queue list
        const cardInCram = await within(cramQueue).findByTestId(cardId);
        expect(cardInCram).toBeInTheDocument();
        expect(cramCount).toHaveTextContent("63");
        // cram-count is increased by 1
    });

    test("fail: can not grade card scheduled for the future", async () => {
        const cardId = "c0320d44-c157-4857-a2b8-39ce89d168f5";
        const GradingTestWithProviders = getComponentWithProviders(
            () => GradingTestComponent(2));
        const errorMessage = "Failed to grade card c0320d44-c157-"
              + "4857-a2b8-39ce89d168f5: Reviewing before card's"
              + " due review date is forbidden.";
        await act(async () => await render(<GradingTestWithProviders/>));
        const cramCount = await screen.findByTestId("cram-count");
        const card = await screen.findByTestId(cardId);
        const cramQueue = await screen.findByTestId("cram-queue");
        fireEvent.click(card);

        // current error handling
        await waitFor(() => expect(console.error).toBeCalled());
        expect(console.error).toHaveBeenCalledWith(errorMessage);
        // cram count doesn't change
        expect(cramCount).toHaveTextContent("62");
        const cardInCram = within(cramQueue).queryByTestId(cardId);
        expect(cardInCram).not.toBeInTheDocument();
    });
});

