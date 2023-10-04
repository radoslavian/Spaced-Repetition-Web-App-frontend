import userEvent from '@testing-library/user-event';
import { render, screen, act, fireEvent,
         waitFor } from "@testing-library/react";
import { within } from "@testing-library/dom";
import { getComponentWithProviders,
         getRenderScreen, showAnswer, logoutUser } from "../utils/testHelpers";
import { useCards } from "../contexts/CardsProvider";
import CardsSelector from "../components/CardsSelector";

// only gradeCard
import axios, {
    downloadCards, axiosMatch, searchAllCards, gradeCard,
    cardsDistribution_12DaysCallback, cardsMemorization_12DaysCallback,
    gradesDistributionRouteCallback,
    eFactorDistributionRouteCallback } from "axios";

describe("<CardsSelector/> - hints for selectors", () => {
    const renderScreen = getRenderScreen(CardsSelector, {
              user: "user_1",
              password: "passwd"
    });
    beforeEach(renderScreen);  // here was act()

    it("displays help for the 'Learn scheduled' button", async () => {
        const learnScheduledButton = await screen
              .findByTestId("learn-all-trigger");
        fireEvent.mouseOver(learnScheduledButton);
        const helpTip = await screen.findByText(
            "Learn scheduled cards first");
        expect(helpTip).toBeInTheDocument();
    });

    it("displays help for the 'Learn from cram' button", async () => {
        const learnFromCramButton = await screen.findByTestId(
            "learn-crammed-trigger");
        fireEvent.mouseOver(learnFromCramButton);
        const helpTip = await screen.findByText(
            "Review crammed cards");
        expect(helpTip).toBeInTheDocument();
    });

    it("displays help for the 'Learn new cards' button", async () => {
        const learnNewCards = await screen.findByTestId(
            "learn-new-trigger");
        fireEvent.mouseOver(learnNewCards);
        const helpTip = await screen.findByText(
            "Learn cards that haven't been put into learning process yet.");
        expect(helpTip).toBeInTheDocument();
    });

    // remaining buttons

});

describe("<CardsSelector/> - general & grading scheduled cards", () => {
    const TestingComponent = getComponentWithProviders(CardsSelector);
    const renderScreen = getRenderScreen(CardsSelector, {
        user: "user_1",
        password: "passwd"
    });

    beforeEach(async () => {
        gradeCard.mockClear();
        await act(renderScreen);
        const learnAllTrigger = await screen.getByTestId("learn-all-trigger");
        fireEvent.click(learnAllTrigger);
        await showAnswer();
    });

    it("displays cards summaries using <LearningProgress/>", async () => {
        // expected data from mockData.js - cramQueueSecondPage,
        // outstandingMiddlePage, queuedCardsMiddlePage
        const componentTestId = "learning-progress-indicator";
        const expectedContent = "Scheduled3Cram62Queued60";
        const learningProgress = await screen.findByTestId(componentTestId);
        expect(learningProgress).toHaveTextContent(expectedContent);
    });

    test("if number of scheduled changes when reviewing", () => {
        // TODO + similar tests for cram and queued
    });

    // there are already tests for new cards

    test("grading - url & the 'pass' grade", async () => {
        const gradePass = screen.getByTestId("grade-button-pass");
        await act(() => fireEvent.click(gradePass));
        const expectedGrade = 3;
        const expectedUrl = "http:localhost:8000/api/users/626e4d32-a52f-4c"
              + "15-8f78-aacf3b69a9b2/cards/memorized/7cf7ed26-bfd2-45a8-a9fc"
              + "-a284a86a6bfa";

        expect(gradeCard).toHaveBeenCalledTimes(1);
        expect(gradeCard).toHaveBeenCalledWith(
            expect.objectContaining(
                {
                    "data": {"grade": 3},
                    "headers": {
                        "Authorization": "Token 7f3371589a52d0ef17877c61d1c8"
                        + "2cdf9b7d8f3f",
                        "Content-Type": "application/json"},
                    "method": "patch",
                    "url": "http://localhost:8000/api/users/626e4d32-a52f-4"
                        + "c15-8f78-aacf3b69a9b2/cards/memorized/7cf7ed26-bf"
                        + "d2-45a8-a9fc-a284a86a6bfa"
                })
        );
    });

    // Remaining grade tests

    test("grading - the 'null' grade", async () => {
        const gradeNull = screen.getByTestId("grade-button-null");
        await act(() => fireEvent.click(gradeNull));
        const expectedGrade = 0;

        expect(gradeCard).toHaveBeenCalledWith(
            expect.objectContaining(
                {data: {"grade": expectedGrade}})
        );
    });

    test("grading - the 'bad' grade", async () => {
        const gradeBad = screen.getByTestId("grade-button-bad");
        await act(() => fireEvent.click(gradeBad));
        const expectedGrade = 1;

        expect(gradeCard).toHaveBeenCalledWith(
            expect.objectContaining(
                {data: {"grade": expectedGrade}})
        );
    });

    test("grading - the 'fail' grade", async () => {
        const gradeFail = screen.getByTestId("grade-button-fail");
        await act(() => fireEvent.click(gradeFail));
        const expectedGrade = 2;

        expect(gradeCard).toHaveBeenCalledWith(
            expect.objectContaining(
                {data: {"grade": expectedGrade}})
        );
    });

    test("grading - the 'good' grade", async () => {
        const gradeGood = screen.getByTestId("grade-button-good");
        await act(() => fireEvent.click(gradeGood));
        const expectedGrade = 4;

        expect(gradeCard).toHaveBeenCalledWith(
            expect.objectContaining(
                {data: {"grade": expectedGrade}})
        );
    });

    test("grading - the 'ideal' grade", async () => {
        const gradeIdeal = screen.getByTestId("grade-button-ideal");
        await act(() => fireEvent.click(gradeIdeal));
        const expectedGrade = 5;

        expect(gradeCard).toHaveBeenCalledWith(
            expect.objectContaining(
                {data: {"grade": expectedGrade}})
        );
    });
});

describe("<CardsSelector/> - loading more pages", () => {
    const renderScreen = getRenderScreen(CardsSelector, {
        user: "user_1",
        password: "passwd"
    });

    test("if component loads another page (outstanding)", async () => {
        await act(renderScreen);
        const learnAllTrigger = await screen.findByTestId(
            "learn-all-trigger");
        const expectedCall = {
            "headers": {
                "Authorization": "Token 7f3371589a52d0ef17877c61d1c82c"
                    + "df9b7d8f3f",
                "Content-Type": "application/json"
            },
            "method": "get",
            "url": "http://localhost:8000/api/users/626e4d32-a52f-4c15-8f78"
                + "-aacf3b69a9b2/cards/outstanding/"
        };
        fireEvent.click(learnAllTrigger);
        axiosMatch.get.mockClear();

        for (let i = 0; i < 2; i++) {
            const showAnswer = await screen.findByText("Show answer");
            await act(() => fireEvent.click(showAnswer));
            const gradeIdeal = await screen.findByTestId(
                "grade-button-ideal");
            await act(() => fireEvent.click(gradeIdeal));
        }
        // fake-api won't acknowledge card review!
        expect(axiosMatch.get).toHaveBeenCalledTimes(1);
        expect(axiosMatch.get).toHaveBeenCalledWith(
            expect.objectContaining(expectedCall));
    });

    test("if component loads another page (new cards)", async () => {
        await act(renderScreen);
        const learnNewTrigger = await screen.findByTestId(
            "learn-new-trigger");
        const expectedUrl = "http://localhost:8000/api/users/626e4d32-a52f"
              + "-4c15-8f78-aacf3b69a9b2/cards/queued/";
        fireEvent.click(learnNewTrigger);
        axiosMatch.get.mockClear();

        for (let i = 0; i < 2; i++) {
            const showAnswer = await screen.findByText("Show answer");
            await act(() => fireEvent.click(showAnswer));
            const gradeIdeal = await screen.findByTestId(
                "grade-button-ideal");
            await act(() => fireEvent.click(gradeIdeal));
        }
        expect(axiosMatch.get).toHaveBeenCalledTimes(1);
        expect(axiosMatch.get).toHaveBeenCalledWith(
            expect.objectContaining({"url": expectedUrl}));
    });
});

describe("<CardsSelector/> - reviewing crammed & learning new cards", () => {
    const CardsSelectorCramList = () => {
        const { cram } = useCards();
        return (
            <>
              <div data-testid="cram-list">
                {cram.currentPage.map(
                    card => <span key={card.id}
                                  data-testid={card.id}>
                              { card.body }
                            </span>)}
              </div>
              <div data-testid="cards-selector">
                <CardsSelector/>
              </div>
            </>
        );
    };

    afterEach(() => {
        localStorage.clear();
    });

    const defaultCredentials = {
        user: "CardsReviewer_user",
        password: "passwd"
    };
    const userCredentials = {
        user: "user_1",
        password: "passwd"
    };
    const user_2Credentials = {
        user: "user_2",
        password: "passwd"
    };

    const renderScreen = getRenderScreen(CardsSelectorCramList,
                                         defaultCredentials);

    const triggerReviews = async (trigger) => {
        const learnTrigger = await screen.findByTestId(trigger);
        userEvent.click(learnTrigger);
        const showAnswer = await screen.findByTestId("show-answer-button");
        fireEvent.click(showAnswer);
    };

    const crammedCardId = "7cf7ed26-bfd3-45z8-a9fc-a284a86a6bfa";

    it("downloads queue in case of count/next link discrepancy", async () => {
        // next link is empty (next: null), count != 0
        renderScreen(user_2Credentials);
        await logoutUser();
        await triggerReviews("learn-crammed-trigger");
        const gradeFail = await screen.findByTestId("grade-button-fail");
        axiosMatch.get.mockClear();
        fireEvent.click(gradeFail);
        await waitFor(() => expect(axiosMatch.get).toHaveBeenCalledTimes(1));
    });

    it("triggers reviews of outstanding cards", async () => {
        renderScreen(userCredentials);
        const learnOutstandingTrigger = await screen.findByTestId(
            "learn-all-trigger");
        await fireEvent.click(learnOutstandingTrigger);
        await showAnswer();

        const lookUpText = "Example card question.";
        const component = await screen.findByText(lookUpText);
        expect(component).toBeInTheDocument();
    });

    it("triggers reviews of crammed card", async () => {
        await act(() => renderScreen(userCredentials));
        const learnCrammedTrigger = await screen.findByTestId(
            "learn-crammed-trigger");
        await fireEvent.click(learnCrammedTrigger);
        await showAnswer();

        const lookUpText = "Example question on a grammar card."
        + " Example anwer.";
        const component = await screen.findByTestId("card-body");
        expect(component).toHaveTextContent(lookUpText);
    });

    test("if initial page contains triggers", async () => {
        renderScreen();
        const learnAllTrigger = await screen.findByTestId("learn-all-trigger");
        const learnNewTrigger = await screen.findByTestId("learn-new-trigger");
        const cramTrigger = await screen.findByTestId("learn-crammed-trigger");
        expect(learnAllTrigger).toBeInTheDocument();
        expect(learnNewTrigger).toBeInTheDocument();
        expect(cramTrigger).toBeInTheDocument();
    });

    test("selecting to learn new cards", async () => {
        renderScreen(userCredentials);
        await triggerReviews("learn-new-trigger");
        const queuedCardId = "5f143904-c9d1-4e5b-ac00-01258d09965a";
        const queuedCard = await screen.findByTestId(queuedCardId);
        expect(queuedCard).toBeInTheDocument();
    });

    test("stopping reviews and return to the greeting page", async () => {
        renderScreen(userCredentials);
        await triggerReviews("learn-new-trigger");
        const stopTrigger = await screen.findByTestId(
            "stop-reviews-trigger");
        fireEvent.click(stopTrigger);
        const learnAllTrigger = await screen.findByTestId(
            "learn-all-trigger");
        expect(learnAllTrigger).toBeInTheDocument();
    });

    test("calling endpoint for grading crammed card", async () => {
        axiosMatch.delete.mockClear();
        renderScreen(userCredentials);  // ... was not wrapped in act(...).
        triggerReviews("learn-crammed-trigger");
        const gradeIdeal = await screen.findByTestId("grade-button-ideal");
        fireEvent.click(gradeIdeal);
        const expectedCall = {
            "method": "delete",
            "url": "http://localhost:8000/api/users/626e4d32-a52f-4c15-"
                + "8f78-aacf3b69a9b2/cards/cram-queue/7cf7ed26-bfd3-45z8-a9f"
                + "c-a284a86a6bfa"
        };
        expect(axiosMatch.delete).toHaveBeenCalledTimes(1);
        expect(axiosMatch.delete).toHaveBeenCalledWith(
            expect.objectContaining(expectedCall));

    });

    it("gets removed from the cram list after grading it > 3", async () => {
    // ... not configured to support act(...)...
        renderScreen(userCredentials);
        triggerReviews("learn-crammed-trigger");
        const cramList = await screen.findByTestId("cram-list");
        const crammedCard = await within(cramList)
              .findByTestId(crammedCardId);
        const goodGrade = await screen.findByTestId("grade-button-good");
        fireEvent.click(goodGrade);

        await waitFor(() => expect(crammedCard).not.toBeInTheDocument());
    });

    it("should get removed only from client-side cram list", async () => {
        renderScreen(userCredentials);
        axiosMatch.delete.mockClear();
        triggerReviews("learn-crammed-trigger");
        const cardsSelector = await screen.findByTestId("cards-selector");
        const crammedCard =  await within(cardsSelector)
              .findByTestId(crammedCardId);
        const failGrade =  await screen.findByTestId("grade-button-fail");
        fireEvent.click(failGrade);

        // another card from cram queue should appear
        const secondCardId = "1a5c7caf-fe7d-4b14-a022-91d9b52a36a0";
        const secondCard = await within(cardsSelector).findByTestId(secondCardId);
        expect(secondCard).toBeInTheDocument();
        expect(axiosMatch.delete).toHaveBeenCalledTimes(0);
    });

    it("adds card to cram after grading it < 4", async () => {
        renderScreen(userCredentials);

         // * logoutUser() is a f***up way around the following problem:
         // * + if I launch the whole suite (or "describe" block) of tests
         // * renderScreen() apparently renders app for previously logged in
         // * 'user', so that 'clicking' on triggers will list cards for
         // * (that previous user) and not those expected in assertions.

        await logoutUser();
        await triggerReviews("learn-new-trigger");
        const failGrade = await screen.findByTestId("grade-button-fail");
        const cramList = await screen.findByTestId("cram-list");
        fireEvent.click(failGrade);
        const cardAddedToCram = await within(cramList)
              .findByTestId("5f143904-c9d1-4e5b-ac00-01258d09965a");
        expect(cardAddedToCram).toBeInTheDocument();
    });

    const getNoMoreCardsMessage = async groupName => {
        renderScreen();
        const cardGroup = await screen.findByTestId(groupName);
        fireEvent.click(cardGroup);
        const noMoreCardsMessage = await screen.findByTestId(
            "no-more-cards-for-review");
        return noMoreCardsMessage;
    };

    it("displays 'no more cards for review' (after scheduled)", async () => {
        const noMoreCardsMessage = await getNoMoreCardsMessage(
            "learn-all-trigger");
        expect(noMoreCardsMessage).toBeInTheDocument();
    });

    it("displays 'no more cards for review' (after cram)", async () => {
        const noMoreCardsMessage = await getNoMoreCardsMessage(
            "learn-crammed-trigger");
        expect(noMoreCardsMessage).toBeInTheDocument();
    });

    it("displays 'no more cards for review' (after new cards)", async () => {
        const noMoreCardsMessage = await getNoMoreCardsMessage(
            "learn-new-trigger");
        expect(noMoreCardsMessage).toBeInTheDocument();
    });

    test("if cram downloads another set of cards from the server", () => {
        // TODO: add throw if left for another time
    });

    test("if button for scheduled cards show number of reviews", async () => {
        renderScreen(userCredentials);
        const expectedText = "Learn scheduled - 3 left";
        const received = await screen.findByText(expectedText);
        expect(received).toBeInTheDocument();
    });

    test("if button for crammed cards show number of reviews", async () => {
        renderScreen(userCredentials);
        const expectedText = "Learn from cram - 62 left";
        const received = await screen.findByText(expectedText);
        expect(received).toBeInTheDocument();
    });

    test("if button for queued cards show number of reviews", async () => {
        renderScreen(userCredentials);
        const expectedText = "Learn new cards - 60 left";
        const received = await screen.findByText(expectedText);
        expect(received).toBeInTheDocument();
    });
});
