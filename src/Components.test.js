import { render, screen, act, fireEvent,
         waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { within } from "@testing-library/dom";
import CategorySelector from "./components/CategorySelector.js";
import { UserProvider, useUser } from "./contexts/UserProvider";
import { useCards } from "./contexts/CardsProvider";
import { ApiProvider, useApi } from "./contexts/ApiProvider";
import { CategoriesProvider,
         useCategories } from "./contexts/CategoriesProvider";
import CardBrowser from "./components/CardBrowser";
import CardBody from "./components/CardBody";
import { userCategories2 as userCategories } from "./__mocks__/mockData";
import CardCategoryBrowser from "./components/CardCategoryBrowser";
import CardsReviewer from "./components/CardsReviewer";
import CardsSelector from "./components/CardsSelector";
import axios, { downloadCards, axiosMatch, gradeCard } from "axios";
import { getComponentWithProviders } from "./utils/testHelpers";
import { LogInComponent } from "./utils/testHelpers";

describe("CategorySelector tests.", () => {
    beforeAll(() => render(
        <CategorySelector
          categories={userCategories.categories}
          selectedCategories={userCategories.selected_categories}
        />
    ));

    test("if a given text got rendered into a page", () => {
        const categoryName = screen.getByText("Household devices");
        expect(categoryName).toBeInTheDocument();
    });
});

import { useState, useEffect } from "react";
import { timeOut } from "./utils/helpers";

describe("<CardCategoryBrowser/>", () => {
    const TestingComponent = () => {
        const api = useApi();
        const credentials = {user: "user_1",
                             password: "passwd"};
        const [authenticated, setAuthenticated] = useState(undefined);
        // api.authenticate("/auth/token/login/", credentials);

        useEffect(() => {
            (async () => {
                await api.authenticate("/auth/token/login/", credentials);
                if (api.isAuthenticated()) {
                    setAuthenticated(true);
                }
            })();
        }, []);

        // looks like the component is not re-rendered after authentication

        return (
            api.isAuthenticated() ? 
                <CardCategoryBrowser/>
            : <p>Unauthenticated</p>
        );
    };
    const ComponentWithProviders = getComponentWithProviders(
        TestingComponent);

    const renderComponent = async () => await act(() => render(
        <ComponentWithProviders/>));

    beforeEach(async () => await renderComponent());

    test("if component downloads cards from the server", async () => {
        // Something's wrong with CardCategoryBrowser or - more likely
        // - with CategoriesProvider: does not work if
        // <ComponentWithProviders/> is created only once
        
        await renderComponent();
        await waitFor(() => expect(downloadCards).toHaveBeenCalledTimes(2));
    });

    test("if clicking 'load more' works", async () => {
        const loadMoreButton = await screen.findByText("load more");
        fireEvent.click(loadMoreButton);
        const cardMiddle = await screen.findByTestId(
            "f8f3ef31-1554-450f-ad7b-589bfd0e068d");  // allCardsMiddle
        const cardNext = await screen.findByTestId(
            "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa");  // allCardsNext
        fireEvent.click(loadMoreButton);
        const cardNext_1 = await screen.findByTestId(
        "e6e7b3ea-72d7-4663-8c0d-591c7b9fcafb");

        // assert cards from all pages
        expect(cardMiddle).toBeInTheDocument();
        expect(cardNext).toBeInTheDocument();
        expect(cardNext_1).toBeInTheDocument();
    });

    test("if component sends selected categories to the server",
         () => {
             // TODO
         });
});

describe("<CardBrowser>", () => {
    const memorize = jest.fn();
    const forget = jest.fn();
    const cram = jest.fn();
    const disable = jest.fn();
    const enable = jest.fn();
    const loadMore = jest.fn();

    const functions = { memorize, forget, cram, disable, enable };

    const fakeCards = [
        {
            type: "queued",
            body: "<p>Fake <b>card</b> one Very long title Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum lacus quis tellus aliquet, quis ornare felis imperdiet. Vivamus et elit scelerisque sapien blandit consequat vel non eros.</p>",
            id: "3475ddea-2f52-4669-93ee-b1298b1f6c97",
        },
        {
            type: "memorized",
            body: "<p>Fake card two</p>",
            id: "9e477201-5852-48c8-92fb-3520c2bef099",
        },
        {
            type: "disabled",
            body: "<p>Fake card three</p>",
            id: "2ccd1b58-945e-40b3-98df-da6b6fe44266",
        }
    ];

    beforeEach(() => {
        render(<CardBrowser cards={fakeCards}
                            loadMore={loadMore}
                            functions={functions}/>);
    });

    test("if clicking on the 'load more' works", async () => {
        const loadMoreButton = await screen.findByText("load more");
        fireEvent.click(loadMoreButton);
        expect(loadMore).toHaveBeenCalledTimes(1);
    });

    test("if list of cards displays", async () => {
        const listItem = await screen.findByText("Fake card two");
        expect(listItem).toBeVisible();
    });

    test("if long description gets shortened", async () => {
        const listItemWithLongText = await screen.findByText(
            "Fake card one Very long title Lorem ipsum dolor si...");
        expect(listItemWithLongText).toBeVisible();
    });

    test("if queued card is marked with '[queued]' stamp", () => {
        const queuedCard = screen.getByText("[queue]");
        expect(queuedCard).toBeVisible();
    });

    test("if memorized card is marked with '[mem]' stamp", () => {
        const memorizedCard = screen.getByText("[mem]");
        expect(memorizedCard).toBeVisible();
    });

    test("if disabled card is marked with '[dis]' stamp", () => {
        const disabledCard = screen.getByText("[dis]");
        expect(disabledCard).toBeVisible();
    });

    test("if queued card can be memorized", () => {
        const memorizeTrigger = screen.getByText("memorize");
        fireEvent.click(memorizeTrigger);
        expect(memorize).toHaveBeenCalledTimes(1);
    });

    test("if memorized card can be forgotten", () => {
        const forgetTrigger = screen.getByText("forget");
        fireEvent.click(forgetTrigger);
        expect(forget).toHaveBeenCalledTimes(1);
    });

    test("if memorized card can be crammed", () => {
        const cramTrigger = screen.getByTitle("cram memorized card");
        fireEvent.click(cramTrigger);
        expect(cram).toHaveBeenCalledTimes(1);
        expect(cram).toHaveBeenCalledWith(fakeCards[1]);
    });

    test("if queued card can be disabled", () => {
        const disableTrigger = screen.getByTitle("disable queued card");
        fireEvent.click(disableTrigger);
        expect(disable).toHaveBeenCalledTimes(1);
    });

    test("if memorized card can be disabled", () => {
        disable.mockClear();  // move to afterEach
        const disableTrigger = screen.getByTitle("disable memorized card");
        fireEvent.click(disableTrigger);
        expect(disable).toHaveBeenCalledTimes(1);
    });

    test("if disabled card can be re-enabled", () => {
        const enableTrigger = screen.getByTitle("re-enable disabled card");
        fireEvent.click(enableTrigger);
        expect(enable).toHaveBeenCalledTimes(1);
    });
});

describe("<CardBody/>", () => {
    const card = {
        body: `<div class="card-body">
  <div class="card-question">
    Example <b>card</b> <i>question</i>.
  </div>
  <div class="card-answer">
    Example Card answer.
  </div>
</div>`
    };

    test("rendering html tags", () => {
        render(<CardBody card={card}/>);
        const answer = screen.getByText("Example Card answer.");
        expect(answer).toBeInTheDocument();
        expect(answer.className).toBe("card-answer");
    });

    test("displaying answer", () => {
        render(<CardBody card={card} showAnswer={true}/>);
        const answer = screen.getByText("Example Card answer.");
        expect(answer.className).toBe("card-answer-shown");
    });
});

describe("<CardsReviewer/>", () => {
    const Component = () => {
        const cards = useCards();
        const { outstanding } = cards;
        const { grade } = cards.functions;

        return (<CardsReviewer cards={outstanding} gradingFn={grade}/>);
    };

    const TestingComponent = getComponentWithProviders(Component);

    beforeEach(async () => {
        await act(() => render(<TestingComponent/>));
    });

    test("if 'Show answer' click displays buttons with marks", async () => {
        // expect - grade button was not found
        const showAnswer = screen.getByText("Show answer");
        expect(showAnswer).toBeInTheDocument();
        await act(() => fireEvent.click(showAnswer));
        const badGrade = await screen.findByTestId("grade-button-bad");
        expect(badGrade).toBeInTheDocument();

    });

    test("if 'Show answer' click shows answer field", async () => {
        const showAnswer = screen.getByText("Show answer");
        await act(() => fireEvent.click(showAnswer));
        const answer = screen.getByText("Example Card answer.");
        expect(answer).toBeInTheDocument();
        expect(answer.className).toBe("card-answer-shown");
    });

    test("if review process progresses", async () => {
        // Clicking on the grade re-displays the "Show answer" bar,
        // the answer has a "card-answer" class.

        const showAnswer = screen.getByText("Show answer");
        await act(() => fireEvent.click(showAnswer));
        const idealGrade = await screen.findByTestId("grade-button-ideal");
        await act(() => fireEvent.click(idealGrade));
        const showAnswerNext = screen.getByText("Show answer");
        expect(showAnswerNext).toBeInTheDocument();

        // another card from the list is displayed
        const nextCardText = "Example answer (outstanding).";
        const nextCard = screen.getByText(nextCardText);
        expect(nextCard).toBeInTheDocument();
    });
});

describe("<CardsSelector/> - general & grading scheduled cards", () => {
    const TestingComponent = getComponentWithProviders(CardsSelector);

    beforeEach(async () => {
        gradeCard.mockClear();
        await act(() => render(<TestingComponent/>));
        const learnAllTrigger = await screen.findByTestId("learn-all-trigger");
        await fireEvent.click(learnAllTrigger);
        const showAnswer = await screen.findByText("Show answer");
        fireEvent.click(showAnswer);
    });

    it("displays cards summaries using <LearningProgress/>", async () => {
        const componentById = "#learning-progress-indicator";
        // expected data from mockData.js - cramQueueSecondPage,
        // outstandingMiddlePage, queuedCardsMiddlePage
        const expectedContent = "Scheduled: 3 Cram: 62 Queued: 60";
        const learningProgress = await screen.findByText(expectedContent);
        expect(learningProgress).toBeInTheDocument();
    });

    test("if number of scheduled changes when reviewing", () => {
        // TODO + similar tests for cdram and queued
    });

    test("if <CardsReviewer/> displays first card from the queue", async () => {
        const lookUpText = "Example card question.";
        const component = await screen.findByText(lookUpText);
        expect(component).toBeInTheDocument();
    });

    test("grading - url & the 'pass' grade", async () => {
        const gradePass = screen.getByTestId("grade-button-pass");
        await act(() => fireEvent.click(gradePass));
        const expectedGrade = 3;
        const expectedUrl = "http://localhost:8000/api/users/626e4d32-a52f-4c"
              + "15-8f78-aacf3b69a9b2/cards/memorized/7cf7ed26-bfd2-45a8-a9fc"
              + "-a284a86a6bfa";

        expect(gradeCard).toHaveBeenCalledTimes(1);
        expect(gradeCard).toHaveBeenCalledWith(
            expect.objectContaining(
                {data: {"grade": expectedGrade},
                "url": expectedUrl})
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

describe("<CardsSelector/> - loading more pages (outstanding)", () => {
    test("if component loads another page", async () => {
        await act(() => render(<ApiProvider>
                                 <LogInComponent credentials={{
                                     user: "user_1",
                                     password: "passwd"
                                 }}>
                                   <CardsSelector/>
                                 </
                               LogInComponent>
                               </ApiProvider>)
                 );
        const learnAllTrigger = await screen.findByTestId(
            "learn-all-trigger");
        const expectedUrl = "http://localhost:8000/api/users/626e4d32-a52f"
              + "-4c15-8f78-aacf3b69a9b2/cards/outstanding/";
        fireEvent.click(learnAllTrigger);
        axiosMatch.get.mockClear();
        for (let i = 0; i < 2; i++) {
            const showAnswer = await screen.findByText("Show answer");
            await act(() => fireEvent.click(showAnswer));
            const gradeIdeal = await screen.findByTestId("grade-button-ideal");
            await act(() => fireEvent.click(gradeIdeal));
        }
        // fake-api won't acknowledge card review!
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

    const renderScreen = () => render(
        <ApiProvider>
          <LogInComponent credentials={{
              user: "CardsReviewer_user",
              // user: "user_1",
              password: "passwd"
          }}>
            <CardsSelectorCramList/>
          </LogInComponent>
        </ApiProvider>
    );

    const triggerReviews = async (trigger) => {
        const learnAllTrigger = await screen.findByTestId(trigger);
        await userEvent.click(learnAllTrigger);
        const showAnswer = await screen.findByText("Show answer");
        await userEvent.click(showAnswer);
    };

    const crammedCardId = "7cf7ed26-bfd3-45z8-a9fc-a284a86a6bfa";

    test("if initial page contains triggers", () => {
        renderScreen();
        const learnAllTrigger = screen.getByTestId("learn-all-trigger");
        const learnNewTrigger = screen.getByTestId("learn-new-trigger");
        waitFor(() => expect(learnAllTrigger).toBeInTheDocument());
        waitFor(() => expect(learnNewTrigger).toBeInTheDocument());
    });

    test("transition from outstanding to crammed cards", async () => {
        renderScreen();
        await triggerReviews("learn-all-trigger");
        const cardsSelector = await screen.findByTestId("cards-selector");
        const crammedCard = await within(cardsSelector)
              .findByTestId(crammedCardId);
        expect(crammedCard).toBeInTheDocument();
    });

    test("selecting to learn new cards", async () => {
        renderScreen();
        await triggerReviews("learn-new-trigger");
        const queuedCardId = "5f143904-c9d1-4e5b-ac00-01258d09965a";
        const queuedCard = await screen.findByTestId(queuedCardId);
        expect(queuedCard).toBeInTheDocument();
    });

    test("stopping reviews and return to the greeting page", async () => {
        renderScreen();
        await triggerReviews("learn-new-trigger");
        const stopTrigger = await screen.findByTestId("stop-reviews-trigger");
        fireEvent.click(stopTrigger);
        const learnAllTrigger = await screen.findByTestId(
            "learn-all-trigger");
        expect(learnAllTrigger).toBeInTheDocument();
    });

    test("endpoint called for grading crammed card", async () => {
        renderScreen();
        axiosMatch.delete.mockClear();
        triggerReviews("learn-all-trigger");
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
        renderScreen();
        triggerReviews("learn-all-trigger");
        const cramList = screen.getByTestId("cram-list");
        const crammedCard = await within(cramList)
              .findByTestId(crammedCardId);
        const goodGrade = await screen.findByTestId("grade-button-good");
        fireEvent.click(goodGrade);

        await waitFor(() => expect(crammedCard).not.toBeInTheDocument());
    });

    it("should get removed only from client-side cram list", async () => {
        renderScreen();
        axiosMatch.delete.mockClear();
        triggerReviews("learn-all-trigger");
        const cardsSelector = screen.getByTestId("cards-selector");
        const crammedCard = await within(cardsSelector).findByTestId(crammedCardId);
        const failGrade = await screen.findByTestId("grade-button-fail");
        fireEvent.click(failGrade);
        // another card from cram queue should appear
        const secondCardId = "1a5c7caf-fe7d-4b14-a022-91d9b52a36a0";
        const secondCard = await within(cardsSelector).findByTestId(secondCardId);
        expect(secondCard).toBeInTheDocument();
        expect(axiosMatch.delete).toHaveBeenCalledTimes(0);
    });

    test("if cram downloads another set of cards from the server", () => {
        // TODO: add throw if left for another time
    });

    it("adds memorized card to cram after grading it < 4", async () => {
        renderScreen();
        await triggerReviews("learn-new-trigger");
        const failGrade = await screen.findByTestId("grade-button-fail");
        const cramList = await screen.findByTestId("cram-list");
        fireEvent.click(failGrade);
        const cardAddedToCram = await within(cramList)
              .findByTestId("5f143904-c9d1-4e5b-ac00-01258d09965a");
        expect(cardAddedToCram).toBeInTheDocument();
    });
});

import LearningProgress from "./components/LearningProgress";

test("<LearningProgress/> - displaying progress", () => {
    const result = render(<LearningProgress scheduled={20}
                                            cramQueue={10}
                                            queued={90}/>);

    const componentById = "#learning-progress-indicator";
    const learningProgress = result.container.querySelector(componentById);
    expect(learningProgress).toHaveTextContent(
        "Scheduled: 20 Cram: 10 Queued: 90");
});

