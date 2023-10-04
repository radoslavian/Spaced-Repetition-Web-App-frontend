import { screen, waitFor, fireEvent } from "@testing-library/react";
import { useCards } from "../contexts/CardsProvider.js";
import { memorizedCardsSecondPage, memorizedCard,
         queuedCardsMiddlePage,
         cramQueueSecondPage } from "../__mocks__/mockData";
import { getRenderScreen,
         getProviderGeneralTestingComponent,
         getNavigationTestingComponent, waitForDataToLoad
       } from "../utils/testHelpers";

const credentials = {
    user: "user_1",
    password: "passwd"
};

describe("queued cards (general)", () => {
    const TestingComponent = () => getProviderGeneralTestingComponent(
        useCards().queued)();
    const card = queuedCardsMiddlePage.results[0];
    const renderTestingComponent = getRenderScreen(
        TestingComponent, credentials);

    test("if currentPage returned expected output", async () => {
        renderTestingComponent();
        const receivedCard = await screen.findByTestId(card.id);
        expect(receivedCard).toBeInTheDocument();
    });

    test("if count shows expected number of queued cards", async () => {
        renderTestingComponent();
        const receivedCard = await screen.findByTestId("count");
        await waitFor(() => expect(receivedCard).toHaveTextContent("60"));
    });

    test("if isFirst indicates we're not on the first page", async () => {
        renderTestingComponent();
        const isFirst = await screen.findByTestId("is-first");
        await waitFor(() => expect(isFirst).toHaveTextContent("false"));
    });

    test("if isLast indicates we are not on the last page", async () => {
        renderTestingComponent();
        const isLast = await screen.findByTestId("is-last");
        await waitFor(() => expect(isLast).toHaveTextContent("false"));
    });
});

describe("navigation", () => {
    afterAll(jest.clearAllMocks);

    const QueuedTestingComponent = () => getNavigationTestingComponent(
        useCards().queued)();
    const renderTestingComponent = getRenderScreen(
        QueuedTestingComponent, credentials);

    test("rendering next page", async () => {
        renderTestingComponent();
        await waitForDataToLoad();
        const clickNext = await screen.findByTestId("click_nextPage");
        fireEvent.click(clickNext);
        const card = await screen.findByTestId(
            "5cd3446f-0b68-4224-8bb8-f04fe4ed83cb");
        expect(card).toBeInTheDocument();
    });

    test("isLoading indicator", async () => {
        renderTestingComponent();
        const loadMore = await screen.findByTestId("load-more");
        const isLoadingIndicator = await screen.findByTestId("is-loading");
        await waitFor(() => expect(isLoadingIndicator)
                      .toHaveTextContent("false"));
        fireEvent.click(loadMore);
        await waitFor(() => expect(isLoadingIndicator)
                      .toHaveTextContent("true"));
    });

    test("rendering previous page", async () => {
        renderTestingComponent();
        await waitForDataToLoad();
        const clickPrev = await screen.findByTestId("click_prevPage");
        fireEvent.click(clickPrev);
        const card = await screen.findByTestId(
            "f4055d8c-c97f-419f-b6db-61d36f53da47");
        expect(card).toBeInTheDocument();
    });

    test("isFirst should be false", async () => {
        renderTestingComponent();
        await waitForDataToLoad();
        const isFirstValue = await screen.findByTestId("is-first");
        expect(isFirstValue).toHaveTextContent("false");
    });

    test("isFirst should be true", async () => {
        renderTestingComponent();
        await waitForDataToLoad();
        const clickPrev = await screen.findByTestId("click_prevPage");
        fireEvent.click(clickPrev);
        const isFirstValue = await screen.findByTestId("is-first");
        await waitFor(() => expect(isFirstValue).toHaveTextContent("true"));
    });

    test("isLast should be false", async () => {
        await renderTestingComponent();
        const isLastValue = await screen.findByTestId("is-last");
        await waitFor(() => expect(isLastValue).toHaveTextContent("false"));
    });

    test("isLast should be true", async () => {
        renderTestingComponent();
        await waitForDataToLoad();
        const clickNext = await screen.findByTestId("click_nextPage");
        fireEvent.click(clickNext);
        const isLastValue = await screen.findByTestId("is-last");
        await waitFor(() => expect(isLastValue).toHaveTextContent("true"));
    });

    test("goToFirst - returning to the first page", async () => {
        renderTestingComponent();
        await waitForDataToLoad();
        const clickNext = await screen.findByTestId("click_nextPage");
        const cardIdFromInitialPage = "4a58594b-1c84-41f5-b4f0-72dc573b6406";
        const cardFromInitialPage = await screen.findByTestId(
            cardIdFromInitialPage);
        fireEvent.click(clickNext);
        await waitFor(() => expect(cardFromInitialPage)
                      .not.toBeInTheDocument());
        const goToFirst = await screen.findByTestId("go-to-first");
        fireEvent.click(goToFirst);
        expect(await screen.findByTestId(cardIdFromInitialPage))
            .toBeInTheDocument();
    });

    test("load more", async () => {
        renderTestingComponent();
        await waitForDataToLoad();
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
