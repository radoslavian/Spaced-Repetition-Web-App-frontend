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
import AnswerRater from "./components/AnswerRater";
import CardBrowser from "./components/CardBrowser";
import CardBody from "./components/CardBody";
import CardDetails from "./components/CardDetails";
import { userCategories2 as userCategories } from "./__mocks__/mockData";
import CardCategoryBrowser from "./components/CardCategoryBrowser";
import CardsReviewer from "./components/CardsReviewer";
import CardsSelector from "./components/CardsSelector";
import axios, {
    downloadCards, axiosMatch, searchAllCards, gradeCard,
    cardsDistribution_12DaysCallback, cardsMemorization_12DaysCallback,
    gradesDistributionRouteCallback,
    eFactorDistributionRouteCallback } from "axios";
import { getComponentWithProviders } from "./utils/testHelpers";
import { LogInComponent } from "./utils/testHelpers";
import { reviewSuccess, queuedCard } from "./__mocks__/mockData";
import LearnCardsPage from "./components/LearnCardsPage";
import CardPreviewModal from "./components/CardPreviewModal";
import { CardDistributionChart } from "./components/DistributionCharts";
import CardsDistributionPage from "./components/CardsDistributionPage";
import EFactorDistributionPage from "./components/EFactorDistributionPage";
import GradesDistributionPage from "./components/GradesDistributionPage";
import LoginForm from "./components/LoginForm";

async function showAnswer() {
    const showAnswer = await screen.findByText("Show answer");
    fireEvent.click(showAnswer);
}

async function expectToRejectCalls(functions) {
    for (let fn of functions) {
        await expect(async () => {
            await waitFor(() => expect(fn).toHaveBeenCalled());
        }).rejects.toEqual(expect.anything());
    }
}

describe("<LoginForm/>", () => {
    const expectedMessage = "authentication error message";

    it("displays message passed in property", () => {
        render(<LoginForm authMessage={expectedMessage}/>);
        const receivedMessage = screen.getByText(expectedMessage);
        expect(receivedMessage).toBeInTheDocument();
    });

    const setCredentialsFn = jest.fn();
    const username = "Test_Username";
    const password = "Odd#$1Pass65word";
    const credentialsCallbackInput = {
        username: username,
        password: password
    };

    it("sets credentials using a callback", async () => {
        render(<LoginForm setCredentials={setCredentialsFn}/>);

        const usernameInput = screen.getByPlaceholderText("Username");
        const passwordInput = screen.getByPlaceholderText("Password");
        const logInButton = screen.getByText("Log in");

        fireEvent.change(usernameInput, { target: { value: username } });
        fireEvent.change(passwordInput, { target: { value: password } });
        fireEvent.click(logInButton);
        
        await waitFor(() => expect(setCredentialsFn)
                      .toHaveBeenCalledTimes(1));
        expect(setCredentialsFn).toHaveBeenCalledWith(
            expect.objectContaining(credentialsCallbackInput));
    });
});

test("Canvas support works with context", () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  expect(context).not.toBeUndefined();
});

describe("statistic charts/pages", () => {
    // Mock the ResizeObserver
    // otherwise tests for components using chart-js will fail
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    }));

    const distributionSpies = [cardsDistribution_12DaysCallback,
                               cardsMemorization_12DaysCallback,
                               gradesDistributionRouteCallback,
                               eFactorDistributionRouteCallback];

    const resetDistributionSpies = () => {
        for (let distributionSpy of distributionSpies) {
            distributionSpy.mockClear();
        }
    };

    afterEach(resetDistributionSpies);

    describe("<CardsDistributionPage/> for subsequent days", () => {
        const renderComponent = () => render(
            <ApiProvider>
              <LogInComponent credentials={{
                  user: "user_1",
                  password: "passwd"
              }}>
                <CardsDistributionPage/>
              </LogInComponent>
            </ApiProvider>
        );

        beforeEach(() => act(renderComponent));

        it("fetches data from the API", async () => {
            await waitFor(() => expect(cardsDistribution_12DaysCallback)
                          .toHaveBeenCalledTimes(1));
        });

        it("doesn't connect with other API endpoints", async () => {
            await expectToRejectCalls([cardsMemorization_12DaysCallback,
                                       gradesDistributionRouteCallback,
                                       eFactorDistributionRouteCallback]);
        });
    });

    describe("<CardsDistributionPage/> for cards memorization", () => {
        const renderComponent = () => render(
            <ApiProvider>
              <LogInComponent credentials={{
                  user: "user_1",
                  password: "passwd"
              }}>
                <CardsDistributionPage path="distribution/memorized/"
                                       daysRange={12}/>
              </LogInComponent>
            </ApiProvider>
        );

        beforeEach(() => act(renderComponent));

        it("fetches data from the API", async () => {
            await waitFor(() => expect(cardsMemorization_12DaysCallback)
                          .toHaveBeenCalledTimes(1));
        });

        it("doesn't connect with other API endpoints", async () => {
            await expectToRejectCalls([cardsDistribution_12DaysCallback,
                                       gradesDistributionRouteCallback,
                                       eFactorDistributionRouteCallback]);
        });
    });

    describe("<EFactorDistributionPage/>", () => {
        const renderComponent = () => render(
            <ApiProvider>
              <LogInComponent credentials={{
                  user: "user_1",
                  password: "passwd"
              }}>
                <EFactorDistributionPage/>
              </LogInComponent>
            </ApiProvider>
        );

        beforeEach(() => act(renderComponent));

        it("fetches data from the API", async () => {
            await waitFor(() => expect(eFactorDistributionRouteCallback)
                          .toHaveBeenCalledTimes(1));
        });

        it("doesn't connect with other API endpoints", async () => {
            await expectToRejectCalls([cardsMemorization_12DaysCallback,
                                       gradesDistributionRouteCallback,
                                       cardsDistribution_12DaysCallback]);
        });
    });

    describe("<GradesDistributionPage/>", () => {
        const renderComponent = () => render(
            <ApiProvider>
              <LogInComponent credentials={{
                  user: "user_1",
                  password: "passwd"
              }}>
                <GradesDistributionPage/>
              </LogInComponent>
            </ApiProvider>
        );

        beforeEach(() => act(renderComponent));

        it("fetches data from the API", async () => {
            await waitFor(() => expect(gradesDistributionRouteCallback)
                          .toHaveBeenCalledTimes(1));
        });

        it("doesn't connect with other API endpoints", async () => {
            await expectToRejectCalls([cardsMemorization_12DaysCallback,
                                       eFactorDistributionRouteCallback,
                                       cardsDistribution_12DaysCallback]);
        });
    });
});

describe("<CardPreviewModal/>", () => {
    it("displays card details after selecting a tab", async () => {
        render(
            <CardPreviewModal card={reviewSuccess}
                              isCardPreviewOpen={true}
                              closeCardPreview={f => f}/>
        );
        const cardDetailsTab = screen.getByText("Details");
        fireEvent.click(cardDetailsTab);
        const cardDetails = await screen.findByTestId("card-details");

        expect(cardDetails).toBeInTheDocument();
        expect(cardDetails).toHaveTextContent("Last reviewed2023-05-15");
    });
});

describe("<CardDetails/>", () => {
    // component displays: lapses, computed interval, number of reviews etc.

    const renderApp = () => render(
        <ApiProvider>
          <LogInComponent credentials={{
              user: "user_1",
              password: "passwd"
          }}>
            <LearnCardsPage/>
          </LogInComponent>
        </ApiProvider>
    );

    test("displaying scheduled card data within App", async () => {
        renderApp();
        const learnScheduledButton = await screen.findByTestId(
            "learn-all-trigger");
        fireEvent.click(learnScheduledButton);
        const details = await screen.findByTestId("card-details");

        expect(details).toHaveTextContent("Computed interval1");
        expect(details).toHaveTextContent("Reviews1");
        expect(details).toHaveTextContent("Total reviews1");
        expect(details).toHaveTextContent("Last reviewed2023-05-10");
        expect(details).toHaveTextContent("Introduced on2023-05-10");
        expect(details).toHaveTextContent("Review date2023-05-11");
        expect(details).toHaveTextContent("Grade4");
        expect(details).toHaveTextContent("Easiness2.5");
    });

    it("returns to 'empty' message after clicking 'stop'", async () => {
        renderApp();
        const learnScheduledButton = await screen.findByTestId(
            "learn-all-trigger");
        fireEvent.click(learnScheduledButton);
        const details = await screen.findByTestId("card-details");
        const stopButton = await screen.findByTestId(
            "stop-reviews-trigger");
        fireEvent.click(stopButton);

        await waitFor(() => expect(screen.getByTestId("empty-card")));
    });

    test("displaying details of memorized card", () => {
        render(<CardDetails card={reviewSuccess}/>);
        const details = screen.getByTestId("card-details");

        expect(details).toHaveTextContent("Computed interval1");
        expect(details).toHaveTextContent("Lapses0");
        expect(details).toHaveTextContent("Reviews1");
        expect(details).toHaveTextContent("Total reviews1");
        expect(details).toHaveTextContent("Last reviewed2023-05-15");
        expect(details).toHaveTextContent("Introduced on2023-05-10");
        expect(details).not.toHaveTextContent(
            "Introduced on2023-05-10T10:06:01.179692Z");
        expect(details).toHaveTextContent("Review date2023-05-11");
        expect(details).toHaveTextContent("Grade4");
        expect(details).toHaveTextContent("Easiness2.5");
    });

    it("renders notification for empty card", () => {
        render(<CardDetails card={queuedCard}/>);
        const details = screen.getByTestId("empty-card");
        expect(details).toBeInTheDocument();
        expect(details).toHaveTextContent("Card dataempty");
    });
});

describe("<AnswerRater/> - tips with approximate next review", () => {
    // grade buttons should display tooltips for card providing
    // projected review data

    const renderWithProjectedReviews = () => render(
        <AnswerRater card={reviewSuccess}
                     gradingFn={f => f}/>
    );

    const renderWithoutProjecterReviews = () => render(
        <AnswerRater card={queuedCard}
                     gradingFn={f => f}/>
    );

    const triggerGradeButton = gradeButtonTestId => {
        const gradeButton = screen.getByTestId(gradeButtonTestId);
        fireEvent.mouseOver(gradeButton);

        return gradeButton;
    };

    describe("displays projected next review tooltip", () => {
        beforeEach(renderWithProjectedReviews);

        test("null grade", async () => {
            triggerGradeButton("grade-button-null");
            const tooltip = await screen.findByText(
                "Approximate next review: 2023-05-17");

            expect(tooltip).toBeInTheDocument();
        });

        test("bad grade", async () => {
            triggerGradeButton("grade-button-bad");
            const tooltip = await screen.findByText(
                "Approximate next review: 2023-05-18");

            expect(tooltip).toBeInTheDocument();
        });

        test("fail grade", async () => {
            triggerGradeButton("grade-button-fail");
            const tooltip = await screen.findByText(
                "Approximate next review: 2023-05-19");

            expect(tooltip).toBeInTheDocument();
        });

        test("pass grade", async () => {
            triggerGradeButton("grade-button-pass");
            const tooltip = await screen.findByText(
                "Approximate next review: 2023-05-20");

            expect(tooltip).toBeInTheDocument();
        });

        test("good grade", async () => {
            triggerGradeButton("grade-button-good");
            const tooltip = await screen.findByText(
                "Approximate next review: 2023-05-21");

            expect(tooltip).toBeInTheDocument();
        });

        test("ideal grade", async () => {
            triggerGradeButton("grade-button-ideal");
            const tooltip = await screen.findByText(
                "Approximate next review: 2023-05-22");

            expect(tooltip).toBeInTheDocument();
        });
    });

    describe("doesn't display tooltip with review data", () => {
        beforeEach(renderWithoutProjecterReviews);

        test("null grade", async () => {
            triggerGradeButton("grade-button-null");
            const tipTestId = "tooltip-grade-button-null";

            await waitFor(() => expect(
                screen.queryAllByTestId(tipTestId).length).toBe(0));
        });

        test("bad grade", async () => {
            triggerGradeButton("grade-button-bad");
            const tipTestId = "tooltip-grade-button-bad";

            await waitFor(() => expect(
                screen.queryAllByTestId(tipTestId).length).toBe(0));
        });

        test("fail grade", async () => {
            triggerGradeButton("grade-button-fail");
            const tipTestId = "tooltip-grade-button-fail";

            await waitFor(() => expect(
                screen.queryAllByTestId(tipTestId).length).toBe(0));
        });

        test("pass grade", async () => {
            triggerGradeButton("grade-button-pass");
            const tipTestId = "tooltip-grade-button-pass";

            await waitFor(() => expect(
                screen.queryAllByTestId(tipTestId).length).toBe(0));
        });

        test("good grade", async () => {
            triggerGradeButton("grade-button-good");
            const tipTestId = "tooltip-grade-button-good";

            await waitFor(() => expect(
                screen.queryAllByTestId(tipTestId).length).toBe(0));
        });

        test("ideal grade", async () => {
            triggerGradeButton("grade-button-ideal");
            const tipTestId = "tooltip-grade-button-ideal";

            await waitFor(() => expect(
                screen.queryAllByTestId(tipTestId).length).toBe(0));
        });
    });
});

describe("CategorySelector tests.", () => {
    beforeAll(() => render(
        <CategorySelector
          categories={userCategories.categories}
          selectedCategories={userCategories.selected_categories}
        />));

    test("if a given text got rendered into a page", async () => {
        /*const browseAllCardsButton = await screen.findByText(
            "Browse all cards");
        fireEvent.click(browseAllCardsButton);*/
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

        return (
            api.isAuthenticated() ? 
                <CardCategoryBrowser/>
            : <p>Unauthenticated</p>
        );
    };
    const ComponentWithProviders = getComponentWithProviders(
        TestingComponent);

    // const renderComponent = async () => await act(() => render(
    //     <ComponentWithProviders/>));
    const renderComponent = () => render(
        <ApiProvider>
          <LogInComponent credentials={{
              user: "user_1",
              password: "passwd"
          }}>
            <CardCategoryBrowser/>
          </LogInComponent>
        </ApiProvider>
    );

    const renderScreen = async () => {
        act(() => renderComponent());
        const browseAllCardsButton = await screen.findByText(
            "Browse all cards");
        fireEvent.click(browseAllCardsButton);
    };

    beforeEach(() => {
        renderScreen();
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    it("searching: calling api endpoint and returning results", async () => {
        const searchField = await screen.findByPlaceholderText(
            "Search for...");
        const cardsBrowser = await screen.findByText("Browse all cards");
        fireEvent.click(cardsBrowser);
        const searchButton = await screen.findByLabelText("search");
        const expectedUrl = "http://localhost:8000/api/users/626e4d32-"
              + "a52f-4c15-8f78-aacf3b69a9b2/cards/?search=searched+phrase";
        fireEvent.change(searchField, {
            target: { value: "searched phrase" }
        });
        fireEvent.click(searchButton);
        const searchResult = await screen.findByText("Search result");
        
        expect(searchResult).toBeInTheDocument();
        await waitFor(() => expect(searchAllCards).toHaveBeenCalledWith(
            expect.objectContaining(
                {url: expectedUrl})));

        const closeButton = await screen.findByText("Close");
        const clearUrl = "http://localhost:8000/api/users/626e4d32-"
              + "a52f-4c15-8f78-aacf3b69a9b2/cards/";

        // should reset search on closing modal
        downloadCards.mockClear();
        fireEvent.click(closeButton);
        await waitFor(() => {
            expect(downloadCards).toHaveBeenCalledWith(
                expect.objectContaining({url: clearUrl}));
            expect(downloadCards).toHaveBeenCalledTimes(1);
        });
    });

    test("if component downloads cards from the server", async () => {
        // Something's wrong with CardCategoryBrowser or - more likely
        // - with CategoriesProvider: does not work if
        // <ComponentWithProviders/> is created only once
        downloadCards.mockClear();
        await renderComponent();
        await waitFor(() => expect(downloadCards).toHaveBeenCalledTimes(2));
    });

    test("if clicking 'load more' works", async () => {
        const cardMiddle = await screen.findByTestId(
            "f8f3ef31-1554-450f-ad7b-589bfd0e068d");  // allCardsMiddle
        const loadMoreButton = await screen.findByText("load more");
        fireEvent.click(loadMoreButton);

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

    beforeEach(() => window.HTMLElement.prototype.scrollIntoView = jest.fn());

    const functions = { memorize, forget, cram, disable, enable };

    const fakeCards = [
        {
            type: "queued",
            body: "<p>Fake <b>card</b> one Very long title Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum lacus quis tellus aliquet, quis ornare felis imperdiet. Vivamus et elit scelerisque sapien blandit consequat vel non eros.</p>",
            id: "3475ddea-2f52-4669-93ee-b1298b1f6c97",
        },
        {
            type: "memorized",
            body: "memorized fake card",
            id: "9e477201-5852-48c8-92fb-3520c2bef099",
            cram_link: null,
        },
        {
            type: "memorized",
            body: "memorized and crammed fake card",
            id: "aaaaf426-e0b2-4832-b4bc-14e6446b8a69",
            cram_link: "/api/users/7cfaec0a-0cc6-4249-8240-b52e40b4da7a/cards/cram-queue/a0a5e0bb-d17a-4f1a-9945-ecb0bc5fc4ad",
        },
        {
            type: "disabled",
            body: "disabled fake card",
            id: "2ccd1b58-945e-40b3-98df-da6b6fe44266",
        }
    ];

    beforeEach(() => {
        render(<CardBrowser cards={fakeCards}
                            loadMore={loadMore}
                            functions={functions}/>);
    });

    test("card preview", async () => {
        const cardListItem = await screen.findByText(
            "Fake card one Very long title ...");
        const previewAction = within(cardListItem).getByTitle("preview card");
        fireEvent.click(previewAction);
        const previewWindow = await screen.findByTestId(
            "card-preview-window");
        const previewWindowContent = "blandit consequat vel non eros.";

        expect(previewWindow).toBeInTheDocument();
        expect(previewWindow).toHaveTextContent(previewWindowContent);
    });

    test("if clicking on the 'load more' works", async () => {
        const loadMoreButton = await screen.findByText("load more");
        fireEvent.click(loadMoreButton);
        expect(loadMore).toHaveBeenCalledTimes(1);
    });

    test("if list of cards displays", async () => {
        const listItem = await screen.findByText("memorized fake card");
        expect(listItem).toBeVisible();
    });

    test("if long description gets shortened", async () => {
        const listItemWithLongText = await screen.findByText(
            "Fake card one Very long title ...");
        expect(listItemWithLongText).toBeVisible();
    });

    test("if queued card has 'queued...' title", () => {
        const queuedCard = screen.getByTitle("queued - not yet memorized");
        expect(queuedCard).toBeVisible();
    });

    test("if memorized card has 'memorized' title", () => {
        const memorizedCard = screen.getAllByText("memorized fake card");
        expect(memorizedCard[0]).toBeVisible();
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
        const memorizedCard = screen.getByText("memorized fake card");
        const forgetTrigger = within(memorizedCard).getByText("forget");
        fireEvent.click(forgetTrigger);
        expect(forget).toHaveBeenCalledTimes(1);
    });

    test("if memorized card can be crammed", () => {
        const memorizedCard = screen.getByText("memorized fake card");
        const cramTrigger = within(memorizedCard)
              .getByTitle("cram memorized card");
        fireEvent.click(cramTrigger);
        expect(cram).toHaveBeenCalledTimes(1);
        expect(cram).toHaveBeenCalledWith(fakeCards[1]);
    });

    test("if disabled card can be re-enabled", () => {
        const enableTrigger = screen.getByTitle("re-enable disabled card");
        fireEvent.click(enableTrigger);
        expect(enable).toHaveBeenCalledTimes(1);
    });

    test("if crammed card doesn't have the 'cram' action", () => {
        const crammedCard = screen.getByTestId(
            "aaaaf426-e0b2-4832-b4bc-14e6446b8a69");
        const cramActionTitle = "cram memorized card";
        const cramAction = within(crammedCard).queryByTitle(cramActionTitle);
        expect(cramAction).not.toBeInTheDocument();
    });
});

describe("<CardBody/>", () => {
    const frontAudioUrl = "/local/audio/front_audiofile.mp3";
    const backAudioUrl = "/local/audio/back_audiofile.mp3";
    const card = {
        front_audio: frontAudioUrl,
        back_audio: backAudioUrl,
        body: `<div class="card-body">
  <div class="card-question">
    Example <b>card</b> <i>question</i>.
  </div>
  <div class="card-answer">
    Example Card answer.
  </div>
</div>`
    };
    const frontAudioTestId = `basic-audio-player-component-${frontAudioUrl}`;
    const backAudioTestId = `basic-audio-player-component-${backAudioUrl}`;

    test("if question sound component appears on card appearance", () => {
        render(<CardBody card={card} showAnswer={false}/>);
        const audioPlayer = screen.getByTestId(frontAudioTestId);
        expect(audioPlayer).toBeInTheDocument();
    });

    test("if answer sound component doesn't appear", async () => {
        // ... when the answer is hidden
        render(<CardBody card={card} showAnswer={false}/>);
        await expect(async () => {
            await waitFor(
                () => expect(screen.getByTestId(backAudioTestId))
                    .toBeInTheDocument()
            );
        }).rejects.toEqual(expect.anything());
    });

    test("if front audio doesn't appear/when no sound file", () => {
        // sound playback component for the front of the card should
        // not appear if front_audio field is empty
        const localCard = {...card, front_audio: null};
        render(<CardBody card={localCard} showAnswer={false}/>);
        const audioPlayer = screen.queryByTestId(frontAudioTestId);
        expect(audioPlayer).not.toBeInTheDocument();
    });

    test("if back audio doesn't appear/when no sound file", () => {
        // sound playback component for the back of the card should
        // not appear if back_audio field is empty
        const localCard = {...card, back_audio: null};
        render(<CardBody card={localCard} showAnswer={true}/>);
        const audioPlayer = screen.queryByTestId(backAudioTestId);
        expect(audioPlayer).not.toBeInTheDocument();
    });

    test("if answer sound component appears", () => {
        render(<CardBody card={card} showAnswer={true}/>);
        const audioPlayer = screen.getByTestId(backAudioTestId);
        expect(audioPlayer).toBeInTheDocument();
    });

    test("displaying answer", () => {
        render(<CardBody card={card} showAnswer={true}/>);
        const answer = screen.queryByText("Example Card answer.");
        expect(answer).toBeInTheDocument();
        expect(answer.className).toBe("card-answer");
    });

    test("answer is hidden", () => {
        render(<CardBody card={card} showAnswer={false}/>);
        const answer = screen.queryByText("Example Card answer.");
        expect(answer).not.toBeInTheDocument();
    });
});

describe("<CardsReviewer/>", () => {
    const Component = () => {
        const cards = useCards();
        const { outstanding } = cards;
        const { grade } = cards.functions;
        const { setSelectedCategories } = useCategories();

        const outstandingCards = {
            title: "Outstanding cards",
            cardsList: outstanding,
            gradingFn: grade
        };


        return (
            <>
              <span data-testid="category-updater"
                    onClick={() => setSelectedCategories(
                        ["6d18daff-94d1-489b-97ce-969d1c2912a6"])}>
                Update selected categories
              </span>
              <CardsReviewer viewedQueue={outstandingCards}/>
            </>
        );
    };

    beforeEach(() => {
        render(<ApiProvider>
                 <LogInComponent credentials={{
                     user: "user_1",
                     password: "passwd"
                 }}>
                   <Component/>
                 </LogInComponent>
               </ApiProvider>);
    });

    test("updating selected categories hides the answer", async () => {
        // const showAnswer = await screen.findByText("Show answer");
        const showAnswer = await screen.findByTestId("show-answer-button");
        fireEvent.click(showAnswer);
        const answer = await screen.findByText("Example Card answer.");
        // Warning: An update to CategoriesProvider inside a test
        // was not wrapped in act(...). ...
        const categoryUpdater = await screen.findByTestId("category-updater");
        fireEvent.click(categoryUpdater);
        // assert answer is hidden
        // wait for element (answer) to disappear
        await waitFor(() => expect(answer).not.toBeInTheDocument());
    });

    test("if 'Show answer' click displays buttons with marks", async () => {
        // expect - grade button was not found
        const showAnswer = await screen.findByText("Show answer");
        expect(showAnswer).toBeInTheDocument();
        await act(() => fireEvent.click(showAnswer));
        const badGrade = await screen.findByTestId("grade-button-bad");
        expect(badGrade).toBeInTheDocument();

    });

    test("if answer field is hidden", async () => {
        const question = await screen.findByText("Example card question.");
        await expect(async () => {
            await waitFor(
                () => expect(screen.getByText("Example Card answer."))
                             .toBeInTheDocument()
            );
        }).rejects.toEqual(expect.anything());
    });

    test("if 'Show answer' click displays answer field", async () => {
        const showAnswer = await screen.findByText("Show answer");
        fireEvent.click(showAnswer);
        const answer = await screen.findByText("Example Card answer.");
        expect(answer).toBeInTheDocument();
    });

    test("if review process progresses", async () => {
        // Clicking on the grade re-displays the "Show answer" bar,
        // the answer has a "card-answer" class.

        const showAnswer = await screen.findByText("Show answer");
        fireEvent.click(showAnswer);
        const idealGrade = await screen.findByTestId("grade-button-ideal");
        fireEvent.click(idealGrade);
        const showAnswerNext = await screen.findByText("Show answer");
        expect(showAnswerNext).toBeInTheDocument();

        // another card from the list is displayed
        const nextCardText = "Example answer (outstanding).";
        const nextCard = await screen.findByText(nextCardText);
        expect(nextCard).toBeInTheDocument();
    });
});

describe("<CardsSelector/> - hints for selectors", () => {
    beforeEach(() => render(
        <ApiProvider>
          <LogInComponent credentials={{
              user: "user_1",
              password: "passwd"
          }}>
            <CardsSelector/>
          </LogInComponent>
        </ApiProvider>
    ));

    it("displays help for the 'Learn scheduled' button", async () => {
        const learnScheduledButton = screen.getByTestId("learn-all-trigger");
        fireEvent.mouseOver(learnScheduledButton);
        const helpTip = await screen.findByText(
            "Learn scheduled cards first");
        expect(helpTip).toBeInTheDocument();
    });

    it("displays help for the 'Learn from cram' button", async () => {
        const learnFromCramButton = screen.getByTestId(
            "learn-crammed-trigger");
        fireEvent.mouseOver(learnFromCramButton);
        const helpTip = await screen.findByText(
            "Review crammed cards");
        expect(helpTip).toBeInTheDocument();
    });

    it("displays help for the 'Learn new cards' button", async () => {
        const learnNewCards = screen.getByTestId(
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

    beforeEach(async () => {
        gradeCard.mockClear();
        await act(() => render(<TestingComponent/>));
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
        // TODO + similar tests for cdram and queued
    });

    // there are already tests for new cards

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

describe("<CardsSelector/> - loading more pages", () => {
    test("if component loads another page (outstanding)", async () => {
        // act() isn't necessary if following tests
        // await/waitFor etc. for app updates
        await act(() => render(<ApiProvider>
                                 <LogInComponent credentials={{
                                     user: "user_1",
                                     password: "passwd"
                                 }}>
                                   <CardsSelector/>
                                 </LogInComponent>
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
            const gradeIdeal = await screen.findByTestId(
                "grade-button-ideal");
            await act(() => fireEvent.click(gradeIdeal));
        }
        // fake-api won't acknowledge card review!
        expect(axiosMatch.get).toHaveBeenCalledTimes(1);
        expect(axiosMatch.get).toHaveBeenCalledWith(
            expect.objectContaining({"url": expectedUrl}));
    });

    test("if component loads another page (new cards)", async () => {
        await act(() => render(
            <ApiProvider>
              <LogInComponent credentials={{
                  user: "user_1",
                  password: "passwd"
              }}>
                <CardsSelector/>
              </
                LogInComponent>
            </ApiProvider>
        ));
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

    const renderScreen = function(credentials = defaultCredentials) {
        render(
            <ApiProvider>
              <LogInComponent credentials={credentials}>
                <CardsSelectorCramList/>
              </LogInComponent>
            </ApiProvider>
        );
    };

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
        const learnAllTrigger = screen.getByTestId("learn-all-trigger");
        const learnNewTrigger = screen.getByTestId("learn-new-trigger");
        const cramTrigger = screen.getByTestId("learn-crammed-trigger");
        await waitFor(() => expect(learnAllTrigger).toBeInTheDocument());
        await waitFor(() => expect(learnNewTrigger).toBeInTheDocument());
        await waitFor(() => expect(cramTrigger).toBeInTheDocument());
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
        const cramList = screen.getByTestId("cram-list");
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

    it("adds memorized card to cram after grading it < 4", async () => {
        renderScreen(userCredentials);
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

import LearningProgress from "./components/LearningProgress";

test("<LearningProgress/> - displaying progress", () => {
    const result = render(<LearningProgress scheduled={20}
                                            cramQueue={10}
                                            queued={90}/>);

    const learningProgress = screen.getByTestId("learning-progress-indicator");
    expect(learningProgress).toHaveTextContent(
        "Scheduled20Cram10Queued90");

});
