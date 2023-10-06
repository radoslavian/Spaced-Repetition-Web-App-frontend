import { render, screen, act, fireEvent,
         waitFor } from "@testing-library/react";
import { within } from "@testing-library/react";
import AnswerRater from "../components/AnswerRater";
import CardBrowser from "../components/CardBrowser";
import CardBody from "../components/CardBody";
import CardDetails from "../components/CardDetails";
import { userCategories2 as userCategories, reviewSuccess,
         queuedCard } from "../__mocks__/mockData";
import CardCategoryBrowser from "../components/CardCategoryBrowser";
import {
    downloadCards, searchAllCards, 
    cardsDistribution_7DaysCallback, cardsMemorization_7DaysCallback,
    gradesDistributionRouteCallback,
    eFactorDistributionRouteCallback,
    cardsDistribution_TwoWeeksCallback,
    cardsMemorization_TwoWeeksCallback, dropCram } from "axios";
import LearningProgress from "../components/LearningProgress";
import { getRenderScreen,
         renderComponent_waitForUser } from "../utils/testHelpers";
import LearnCardsPage from "../components/LearnCardsPage";
import CardPreviewModal from "../components/CardPreviewModal";
import CardsDistributionPage from "../components/CardsDistributionPage";
import EFactorDistributionPage from "../components/EFactorDistributionPage";
import GradesDistributionPage from "../components/GradesDistributionPage";
import CategorySelector from "../components/CategorySelector";
import LoginForm from "../components/LoginForm";
import LearnButton from "../components/LearnButton";
import DropCramModal from "../components/DropCramModal";
import CardsMenu from "../components/CardsMenu";

async function expectToRejectCalls(functions) {
    for (let fn of functions) {
        await expect(async () => {
            await waitFor(() => expect(fn).toHaveBeenCalled());
        }).rejects.toEqual(expect.anything());
    }
}

const credentials = {
    user: "user_1",
    password: "passwd"
};

describe("<CardsMenu/>", () => {
    const renderComponent = getRenderScreen(CardsMenu, credentials);
    
    it("sends request to drop cram", async () => {
        renderComponent();
        const cardsMenu = await screen.findByTestId("cards-menu");
        fireEvent.mouseOver(cardsMenu);
        const dropCramTrigger = await screen.findByText("Drop cram");
        fireEvent.click(dropCramTrigger);
        const modal = await screen.findByTestId(
            "drop-cram-confirmation-dialog");
        const dropButton = await within(modal).findByText("Drop cram");
        dropCram.mockClear();
        fireEvent.click(dropButton);
        expect(dropCram).toHaveBeenCalledTimes(1);        
    });
});

describe("<DropCramModal/>", () => {
    const dropFn = jest.fn();

    const showDropCramModal = async () => {
        render(<DropCramModal isModalOpen={true}
                              dropFunction={dropFn}/>);
        const modal = await screen.findByTestId(
            "drop-cram-confirmation-dialog");
        return modal;
    };

    afterEach(dropFn.mockClear);

    it("should display request to confirm dropping cram", async () => {
        render(<DropCramModal isModalOpen={true}/>);
        const confirmationText = "Are you really sure to remove "
              + "cards from the cram queue?";
        expect(await screen.findByText(confirmationText)).toBeInTheDocument();
    });

    it("should drop cram queue", async () => {
        const confirmationModal = await showDropCramModal();
        const dropButton = await within(confirmationModal)
              .findByText("Drop cram");
        fireEvent.click(dropButton);

        expect(dropFn).toHaveBeenCalledTimes(1);
    });

    it("should cancel removing the cram", async () => {
        const confirmationModal = await showDropCramModal();
        const cancelRemoving = await within(confirmationModal)
              .findByText("Cancel");
        fireEvent.click(cancelRemoving);

        await expect(async () => {
            await waitFor(() => expect(dropFn).toHaveBeenCalled());
        }).rejects.toEqual(expect.anything());
    });
});

describe("<LearnButton/>", () => {
    const popOverTitle = "Pop-over title";
    const popOverContent = "Pop-over content";
    const buttonTitle = "Button title";

    const buttonPopoverContent = {
        title: popOverTitle,
        content: popOverContent
    };

    it("displays pop-over (together with title)", async () => {
        render(<LearnButton popoverContent={buttonPopoverContent}
                            buttonTitle={buttonTitle}
                            dataTestId="learn-button"/>);
        const learnButton = screen.getByTestId("learn-button");
        fireEvent.mouseOver(learnButton);

        expect(screen.getByText(buttonTitle)).toBeInTheDocument();
        expect(await screen.findByText(popOverTitle)).toBeInTheDocument();
        expect(screen.getByText(popOverContent)).toBeInTheDocument();
    });

    it("displays count", () => {
        render(<LearnButton count={125}
                            dataTestId="learn-button"/>);
        const foundText = screen.getAllByText(
            (_, element) => element.textContent === "125")[0];
        expect(foundText).toBeInTheDocument();
    });
});

describe("<LoginForm/>", () => {
    const expectedMessages = ["authentication error message"];
    const multipleMessages = ["message number one", "message number two"];

    it("displays multiple messages passed in property", () => {
        render(<LoginForm authMessages={multipleMessages}/>);
        const messageOne = screen.getByText(multipleMessages[0]);
        const messageTwo = screen.getByText(multipleMessages[1]);

        expect(messageOne).toBeInTheDocument();
        expect(messageTwo).toBeInTheDocument();
    });

    it("displays message passed in property", () => {
        render(<LoginForm authMessages={expectedMessages}/>);
        const receivedMessage = screen.getByText(expectedMessages[0]);
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

describe("statistics charts/pages", () => {
    // Mock the ResizeObserver
    // otherwise tests for components using chart-js will fail
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    }));

    const distributionSpies = [cardsDistribution_7DaysCallback,
                               cardsMemorization_7DaysCallback,
                               gradesDistributionRouteCallback,
                               eFactorDistributionRouteCallback];

    const resetDistributionSpies = () => {
        for (let distributionSpy of distributionSpies) {
            distributionSpy.mockClear();
        }
    };

    afterEach(resetDistributionSpies);

    describe("<CardsDistributionPage/> for subsequent days", () => {
        const renderComponent = getRenderScreen(
            CardsDistributionPage, {
                user: "user_1",
                password: "passwd"
            }
        );

        test("selecting days range: two weeks", async () => {
            await renderComponent_waitForUser(renderComponent);
            const twoWeeksSelector = await screen.findByText(
                "two weeks");
            fireEvent.click(twoWeeksSelector);

            expect(cardsDistribution_TwoWeeksCallback)
                          .toHaveBeenCalledTimes(1);
        });

        it("fetches data from the API", async () => {
            renderComponent();
            await waitFor(() => expect(cardsDistribution_7DaysCallback)
                          .toHaveBeenCalledTimes(1));
        });

        it("doesn't connect with other API endpoints", async () => {
            renderComponent();
            await expectToRejectCalls([cardsMemorization_7DaysCallback,
                                       gradesDistributionRouteCallback,
                                       eFactorDistributionRouteCallback]);
        });
    });

    describe("<CardsDistributionPage/> for cards memorization", () => {
        const renderComponent = getRenderScreen(
            () => (<CardsDistributionPage path="distribution/memorized/"/>), {
                                              user: "user_1",
                                              password: "passwd"
                                          }
        );

        test("selecting days range: two weeks", async () => {
            await renderComponent_waitForUser(renderComponent);
            const twoWeeksSelector = await screen.findByText("two weeks");
            fireEvent.click(twoWeeksSelector);

            expect(cardsMemorization_TwoWeeksCallback)
                .toHaveBeenCalledTimes(1);
        });

        it("fetches data from the API", async () => {
            renderComponent();
            await waitFor(() => expect(cardsMemorization_7DaysCallback)
                          .toHaveBeenCalledTimes(1));
        });

        it("doesn't connect with other API endpoints", async () => {
            renderComponent();
            await expectToRejectCalls([cardsDistribution_7DaysCallback,
                                       gradesDistributionRouteCallback,
                                       eFactorDistributionRouteCallback]);
        });
    });

    describe("<EFactorDistributionPage/>", () => {
        const renderComponent = getRenderScreen(
            EFactorDistributionPage, {
                user: "user_1",
                password: "passwd"
            }
        );

        beforeEach(() => act(renderComponent));

        it("fetches data from the API", async () => {
            await waitFor(() => expect(eFactorDistributionRouteCallback)
                          .toHaveBeenCalledTimes(1));
        });

        it("doesn't connect with other API endpoints", async () => {
            await expectToRejectCalls([cardsMemorization_7DaysCallback,
                                       gradesDistributionRouteCallback,
                                       cardsDistribution_7DaysCallback]);
        });
    });

    describe("<GradesDistributionPage/>", () => {
        const renderComponent = getRenderScreen(
            GradesDistributionPage, {
                user: "user_1",
                password: "passwd"
            }
        );

        beforeEach(() => act(renderComponent));

        it("fetches data from the API", async () => {
            await waitFor(() => expect(gradesDistributionRouteCallback)
                          .toHaveBeenCalledTimes(1));
        });

        it("doesn't connect with other API endpoints", async () => {
            await expectToRejectCalls([cardsMemorization_7DaysCallback,
                                       eFactorDistributionRouteCallback,
                                       cardsDistribution_7DaysCallback]);
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
    const renderApp = getRenderScreen(LearnCardsPage, {
        user: "user_1",
        password: "passwd"
    });

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
    test("if a given text got rendered into a page", async () => {
        render(
            <CategorySelector
              categories={userCategories.categories}
              selectedCategories={userCategories.selected_categories}
            />);
        const categoryName = screen.getByText("Household devices");
        expect(categoryName).toBeInTheDocument();
    });
});

describe("<CardCategoryBrowser/>", () => {
    const renderComponent = getRenderScreen(CardCategoryBrowser, {
        user: "user_1",
        password: "passwd"
    });

    const clickBrowseAllCards = async () => {
        const browseAllCardsButton = await screen.findByText(
            "Browse all cards");
        fireEvent.click(browseAllCardsButton);
        const noData = await screen.findByText("No data");
        await waitFor(() => expect(noData).not.toBeInTheDocument());
        screen.debug();
    };

    beforeEach(() => {
        renderComponent();
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    it("searching: calling api endpoint and returning results", async () => {
        await clickBrowseAllCards();
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
        await clickBrowseAllCards();
        const cardMiddle = await screen.findByTestId(
            "f8f3ef31-1554-450f-ad7b-589bfd0e068d");  // allCardsMiddle

        const loadMoreButton = await screen.findByTestId("load-more-button");
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
            await screen.findByTestId(backAudioTestId);
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

test("<LearningProgress/> - displaying progress", () => {
    render(<LearningProgress scheduled={20}
                             cramQueue={10}
                             queued={90}/>);

    const learningProgress = screen.getByTestId("learning-progress-indicator");
    expect(learningProgress).toHaveTextContent(
        "Scheduled20Cram10Queued90");

});

