import { render, act, waitFor, screen, within,
         fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
import { axiosMatch } from "axios";
import { useUser } from "../contexts/UserProvider";
import { useCards } from "../contexts/CardsProvider.js";
import { memorizedCardsSecondPage, memorizedCard,
         queuedCardsMiddlePage,
         cramQueueSecondPage } from "../__mocks__/mockData";
import { getComponentWithProviders,
         getNavigationTestingComponent,
         getProviderGeneralTestingComponent,
         getRenderScreen, waitForDataToLoad } from "../utils/testHelpers";

const credentials = {
    user: "user_1",
    password: "passwd"
};

describe("general tests", () => {
    const TestingComponent = () => getProviderGeneralTestingComponent(
    useCards().memorized)();

    const renderComponentWithProviders = getRenderScreen(
        TestingComponent, credentials);
    const card = memorizedCardsSecondPage.results[0];

    test("if currentPage returned expected output", async () => {
        renderComponentWithProviders();
        const receivedCard = await screen.findByTestId(card.id);
        expect(receivedCard).toBeInTheDocument();
    });

    test("if count shows expected number of memorized cards", async () => {
        renderComponentWithProviders();
        const receivedCard = await screen.findByTestId("count");
        await waitFor(() => expect(receivedCard).toHaveTextContent("62"));
    });

    test("isFirst indicates we're not on the first page", async () => {
        renderComponentWithProviders();
        const isFirst = await screen.findByTestId("is-first");
        await waitFor(() => expect(isFirst).toHaveTextContent("false"));
    });

    test("isLast indicates we are not on the last page", async () => {
        renderComponentWithProviders();
        const isLast = await screen.findByTestId("is-last");
        await waitFor(() => expect(isLast).toHaveTextContent("false"));
    });
});

describe("navigation", () => {
    afterAll(jest.clearAllMocks);

    const TestingComponent = () => getNavigationTestingComponent(
        useCards().memorized)();
    const renderComponentWithProviders = getRenderScreen(
        TestingComponent, credentials);

    test("next page", async () => {
        renderComponentWithProviders();
        const clickNext = await screen.findByTestId("click_nextPage");
        await waitForDataToLoad();
        fireEvent.click(clickNext);

        const card = await screen.findByTestId(
            "b9f2a0ec-fac1-4574-a553-26c5e8d8b5ab");
        expect(card).toBeInTheDocument();
    });

    test("isLoading indicator", async () => {
        renderComponentWithProviders();
        await waitForDataToLoad();
        const loadMore = await screen.findByTestId("load-more");
        const isLoadingIndicator = await screen.findByTestId("is-loading");
        await waitFor(() => expect(isLoadingIndicator)
                      .toHaveTextContent("false"));
        fireEvent.click(loadMore);
        await waitFor(() => expect(isLoadingIndicator)
                      .toHaveTextContent("true"));
    });

    test("load more", async () => {
        renderComponentWithProviders();
        const loadMore = await screen.findByTestId("load-more");
        await waitForDataToLoad();
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
        renderComponentWithProviders();
        const clickPrev = await screen.findByTestId("click_prevPage");
        await waitForDataToLoad();
        fireEvent.click(clickPrev);
        const card = await screen.findByTestId(
            "3dc52454-4931-4583-9737-81e6a56ac127");
        expect(card).toBeInTheDocument();
    });

    test("goToFirst - returning to the first page", async () => {
        renderComponentWithProviders();
        const clickNext = await screen.findByTestId("click_nextPage");
        const cardIdFromInitialPage = "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa";
        await waitForDataToLoad();
        fireEvent.click(clickNext);
        await waitForElementToBeRemoved(
            () => screen.queryByTestId(cardIdFromInitialPage));
        const goToFirst = await screen.findByTestId("go-to-first");
        fireEvent.click(goToFirst);
        const cardFromInitialPage = await screen.findByTestId(
            cardIdFromInitialPage);
        expect(cardFromInitialPage).toBeInTheDocument();
    });
});

describe("memorizing cards", () => {
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
    
    const renderFunctionsTestingComponent = getRenderScreen(
        FunctionsTestingComponent, credentials);

    test("memorizing queued card", async () => {
        renderFunctionsTestingComponent();
        const memorize = await screen.findByTestId("click-memorize-card");
        const expectedUrl = "http://localhost:8000/api/users/626e4d32-a5"
              + "2f-4c15-8f78-aacf3b69a9b2/cards/queued/5f143904-c9d1-4e5b"
              + "-ac00-01258d09965a";
        const expectedGrade = 2;
        axiosMatch.patch.mockClear();

        fireEvent.click(memorize);
        await waitFor(() => expect(
            axiosMatch.patch).toHaveBeenCalledTimes(1));
        const mockCalls = axiosMatch.patch.mock.calls[0][0];
        expect(mockCalls.url).toEqual(expectedUrl);
        expect(mockCalls.data.grade).toEqual(expectedGrade);
    });

    function MemorizedCardsComponent() {
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

    const renderMemorizedCardsComponent = getRenderScreen(
        MemorizedCardsComponent, credentials);

    test("if memorized card is removed from queued cards list", async () => {
        renderMemorizedCardsComponent();
        const queuedCards = await screen.findByTestId("queued-cards");
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
        renderMemorizedCardsComponent();
        const queuedCount = await screen.findByTestId("queued-cards-count");
        const queuedCards = screen.getByTestId("queued-cards");
        const queuedCard = await within(queuedCards).findByTestId(
            "5f143904-c9d1-4e5b-ac00-01258d09965a");
        fireEvent.click(queuedCard);

        await waitFor(() => expect(queuedCount).toHaveTextContent(59));
    });

    test("if memorized.count is increases by 1", async () => {
        renderMemorizedCardsComponent();
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
             renderMemorizedCardsComponent();
             const allCards = await screen.findByTestId("all-cards");
             const card = await within(allCards)
                   .findByTestId("5f143904-c9d1-4e5b-ac00-01258d09965a");
             expect(card).toHaveTextContent("queued");
             fireEvent.click(card);
             // text-content change after memorization:
             await waitFor(() => expect(card).toHaveTextContent("memorized"));
         });

    test("if memorized card appeared on the list of memorized cards",
         async () => {
             renderMemorizedCardsComponent();
             const allCards = await screen.findByTestId("all-cards");
             const card = await within(allCards)
                   .findByTestId("5f143904-c9d1-4e5b-ac00-01258d09965a");
             // memorize card
             fireEvent.click(card);
             const memorizedCards = screen.getByTestId("memorized-cards");
             const memorizedCard = await within(memorizedCards)
                   .findByTestId("5f143904-c9d1-4e5b-ac00-01258d09965a");
             expect(memorizedCard).toBeInTheDocument();
         });

    test("if cards from other lists are not present in memorizedCards",
         async () => {
             renderMemorizedCardsComponent();
             const allCards = await screen.findByTestId("all-cards");
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
             fireEvent.click(card);
             await expect(async () => {
                 await waitFor( () => expect(cardFromCram).toBeInTheDocument());
             }).rejects.toEqual(expect.anything());
             await expect(async () => {
                 await waitFor(() => expect(cardFromQueue).toBeInTheDocument());
             }).rejects.toEqual(expect.anything());
         });
});

