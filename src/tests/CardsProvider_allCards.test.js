import { render, act, waitFor, screen, within,
         fireEvent } from "@testing-library/react";
import { axiosMatch, downloadCards, gradeCard, forgetCard,
         getQueuedCard } from "axios";
import { ApiProvider, useApi } from "../contexts/ApiProvider";
import { useCards } from "../contexts/CardsProvider.js";
import { memorizedCardsSecondPage, memorizedCard,
         queuedCardsMiddlePage,
         cramQueueSecondPage } from "../__mocks__/mockData";
import { getComponentWithProviders,
         LogInComponent, getRenderScreen,
         getNavigationTestingComponent, getProviderGeneralTestingComponent,
         waitForDataToLoad } from "../utils/testHelpers";

const credentials = {
    user: "user_1",
    password: "passwd"
};

describe("general", () => {
    const TestingComponent = () => getProviderGeneralTestingComponent(
        useCards().all)();
    const renderComponent = getRenderScreen(
        TestingComponent, credentials);

    // data: allCardsMiddle

    test("if currentPage returned expected output", async () => {
        renderComponent();
        const receivedCard = await screen.findByTestId(
            "f8f3ef31-1554-450f-ad7b-589bfd0e068d");  // memorized
        expect(receivedCard).toBeInTheDocument();
    });

    test("if count shows expected number of cards", async () => {
        renderComponent();
        const receivedCard = await screen.findByTestId("count");
        await waitFor(() => expect(receivedCard).toHaveTextContent("122"));
    });

    test("if isFirst indicates we're not on the first page", async () => {
        renderComponent();
        const isFirst = await screen.findByTestId("is-first");
        await waitFor(() => expect(isFirst).toHaveTextContent("false"));
    });

    test("if isLast indicates we are not on the last page", async () => {
        renderComponent();
        await waitForDataToLoad();
        const isLast = await screen.findByTestId("is-last");
        expect(isLast).toHaveTextContent("false");
    });
});

describe("navigation", () => {
    const AllCardsTestingComponent = () => getNavigationTestingComponent(
        useCards().all)();
    const renderComponent = getRenderScreen(
        AllCardsTestingComponent, credentials);

    test("isLoading indicator", async () => {
        renderComponent();
        await waitForDataToLoad();
        const loadMore = await screen.findByTestId("load-more");
        const isLoadingIndicator = await screen.findByTestId("is-loading");
        await waitFor(() => expect(isLoadingIndicator)
                      .toHaveTextContent("false"));
        fireEvent.click(loadMore);
        await waitFor(() => expect(isLoadingIndicator)
                      .toHaveTextContent("true"));
    });

    test("rendering next page", async () => {
        renderComponent();
        await waitForDataToLoad();
        const clickNext = await screen.findByTestId("click_nextPage");
        fireEvent.click(clickNext);
        const card = await screen.findByTestId(
            "f4055d8c-c97f-419f-b6db-62d36f53da47");
        expect(card).toBeInTheDocument();
    });

    test("rendering previous page", async () => {
        renderComponent();
        await waitForDataToLoad();
        const clickPrev = await screen.findByTestId("click_prevPage");
        fireEvent.click(clickPrev);
        const card = await screen.findByTestId(
            "5cd3446f-0b68-4224-8bb8-f04fe4ed83cb");
        expect(card).toBeInTheDocument();
    });

    test("load more", async () => {
        // currentPage, after hitting loadMore, shows items from the first
        // and second page
        renderComponent();
        await waitForDataToLoad();
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
        renderComponent();
        await waitForDataToLoad();
        const loadMore = await screen.findByTestId("load-more");
        const goToFirst = await screen.findByTestId("go-to-first");
        fireEvent.click(loadMore);
        fireEvent.click(goToFirst);

        // StackOverflow recipe:
        // https://stackoverflow.com/questions/68400489/how-to-wait-to-assert
        // -an-element-never-appears-in-the-document
        await expect(async () => {
            await screen.findByTestId("7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa");
        }).rejects.toEqual(expect.anything());        
    });
});
