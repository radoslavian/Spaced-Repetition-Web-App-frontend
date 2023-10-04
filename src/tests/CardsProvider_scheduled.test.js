import { waitFor, screen, fireEvent } from "@testing-library/react";
import { useCards } from "../contexts/CardsProvider.js";
import { memorizedCardsSecondPage, memorizedCard,
         queuedCardsMiddlePage,
         cramQueueSecondPage } from "../__mocks__/mockData";
import { getComponentWithProviders, getRenderScreen,
         getNavigationTestingComponent, getProviderGeneralTestingComponent,
         waitForDataToLoad } from "../utils/testHelpers";

const credentials = {
    user: "user_1",
    password: "passwd"
};

describe("general", () => {
    const TestingComponent = () => getProviderGeneralTestingComponent(
        useCards().outstanding)();
    const ComponentWithProviders = getComponentWithProviders(
        TestingComponent, credentials);
    const renderTestingComponent = getRenderScreen(
        TestingComponent, credentials);

    test("if currentPage returned expected output", async () => {
        await renderTestingComponent();
        const receivedCard = await screen.findByTestId(
            "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa");
        expect(receivedCard).toBeInTheDocument();
    });

    test("if count shows expected number of cards", async () => {
        await renderTestingComponent();
        const receivedCard = await screen.findByTestId("count");
        await waitFor(() => expect(receivedCard).toHaveTextContent("3"));
    });

    test("if isFirst indicates we're not on the first page", async () => {
        await renderTestingComponent();
        await waitForDataToLoad();
        const isFirst = await screen.findByTestId("is-first");
        expect(isFirst).toHaveTextContent("false");
    });

    test("if isLast indicates we are not on the last page", async () => {
        await renderTestingComponent();
        await waitForDataToLoad();
        const isLast = await screen.findByTestId("is-last");
        expect(isLast).toHaveTextContent("false");
    });
});

describe("navigation", () => {
    const TestingComponent = () => getNavigationTestingComponent(
        useCards().outstanding)();
    const renderComponentWithProviders = getRenderScreen(
        TestingComponent, credentials);

    test("load more", async () => {
        renderComponentWithProviders();
        await waitForDataToLoad();
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
        renderComponentWithProviders();
        await waitForDataToLoad();
        const loadMore = await screen.findByTestId("load-more");
        const goToFirst = await screen.findByTestId("go-to-first");
        fireEvent.click(loadMore);
        fireEvent.click(goToFirst);

        await expect(async () => {
            await screen.findByTestId("c6168ba7-6eac-4e1c-806b-3ce111bcdec3");
        }).rejects.toEqual(expect.anything());
    });

    test("rendering next page", async () => {
        renderComponentWithProviders();
        await waitForDataToLoad();
        const clickNext = await screen.findByTestId("click_nextPage");
        fireEvent.click(clickNext);
        const card = await screen.findByTestId(
            "c6168ba7-6eac-4e1c-806b-3ce111bcdec3");
        expect(card).toBeInTheDocument();
    });

    test("rendering previous page", async () => {
        renderComponentWithProviders();
        await waitForDataToLoad();
        const clickPrev = await screen.findByTestId("click_prevPage");
        fireEvent.click(clickPrev);
        const card = await screen.findByTestId(
            "91d1ef25-b1c8-4c49-8b00-215f90088232");
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
});
