import { waitFor, screen, within,
         fireEvent } from "@testing-library/react";
import { downloadCards, dropCram, axiosMatch } from "axios";
import { useCards } from "../contexts/CardsProvider.js";
import { memorizedCardsSecondPage, memorizedCard,
         queuedCardsMiddlePage,
         cramQueueSecondPage } from "../__mocks__/mockData";
import { getRenderScreen, getProviderGeneralTestingComponent,
         getNavigationTestingComponent, waitForDataToLoad
       } from "../utils/testHelpers";

const credentials = {user: "user_1",
                     password: "passwd"};

describe("general", () => {
    const TestingComponent = () => getProviderGeneralTestingComponent(
        useCards().cram)();
    const card = cramQueueSecondPage.results[0];
    const renderComponent = getRenderScreen(TestingComponent, credentials);

    test("if currentPage returned expected output", async () => {
        renderComponent();
        const receivedCard = await screen.findByTestId(card.id);
        expect(receivedCard).toBeInTheDocument();
    });

    test("if count shows expected number of cards", async () => {
        renderComponent();
        const receivedCard = await screen.findByTestId("count");
        await waitFor(() => expect(receivedCard).toHaveTextContent("62"));
    });

    test("if isFirst indicates we're not on the first page", async () => {
        renderComponent();
        const isFirst = await screen.findByTestId("is-first");
        await waitFor(() => expect(isFirst).toHaveTextContent("false"));
    });

    test("if isLast indicates we are not on the last page", async () => {
        renderComponent();
        const isLast = await screen.findByTestId("is-last");
        await waitFor(() => expect(isLast).toHaveTextContent("false"));
    });
});

describe("dropping cram", () => {
    const printCards = cards => cards.currentPage.map(card => (
        <div key={ card.id }
             data-testid={ card.id }>
          { Boolean(card?.cram_link) ?
            <span data-testid="cram-link">
              { card.cram_link }
            </span>
            : "" }
        </div>
    ));

    const DroppingCramComponent = () => {
        const cards = useCards();
        const { cram, all, memorized, outstanding } = cards;
        const { dropCram } = cards.functions;

        return (
            <>
              <div data-testid="cram-queue">
                { printCards(cram) }
              </div>
              <div data-testid="all-cards">
                { printCards(all) }
              </div>
              <div data-testid="memorized">
                { printCards(memorized) }
              </div>
              <div data-testid="outstanding-cards">
                { printCards(outstanding) }
              </div>
              <span data-testid="drop-cram"
                    onClick={ () => dropCram() }/>
            </>
        );
    };

    const removeCram = async () => fireEvent.click(
        await screen.findByTestId("drop-cram"));

    const getAllCramLinks = async group => await within(group)
          .findAllByTestId("cram-link");

    const renderComponent = getRenderScreen(
        DroppingCramComponent, credentials);

    test("removing cram-links in allCards", async () => {
        renderComponent();

        const allCards = await screen.findByTestId("all-cards");

        // placeholder test
        // wait till cards are loaded
        await within(allCards).findByTestId(
            "5b457c11-b751-436c-9cfe-f3f4d173c1ba");

        // I struggled all day to get the test to work -
        // I had to wait until the cards were loaded and then
        // call the function to delete the cram.
        await removeCram();

        await waitFor(() => expect(
            within(allCards).queryAllByTestId(
                "cram-link").length).toEqual(0));
    });

    test("removing cram-links in memorized cards", async () => {
        renderComponent();
        const memorized = await screen.findByTestId("memorized");
        await within(memorized).findByTestId(
            "5949947a-92ad-4e10-94dc-51c7da11c6e8");
        await removeCram();
        await waitFor(() => expect(
            within(memorized).queryAllByTestId(
                "cram-link").length).toEqual(0));
    });

    test("removing cram-links in scheduled cards", async () => {
        renderComponent();
        const scheduled = await screen.findByTestId("outstanding-cards");
        await within(scheduled).findByTestId(
            "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa");
        await removeCram();
        // const cramLinks = await getAllCramLinks(scheduled);
        // expect(cramLinks.length).toEqual(0);
        await waitFor(() => expect(
            within(scheduled).queryAllByTestId(
                "cram-link").length).toEqual(0));
    });

    test("success", async () => {
        renderComponent();
        const cramQueue = await screen.findByTestId("cram-queue");
        const controlCardId = "1a5c7caf-fe7d-4b14-a022-91d9b52a36a0";
        const controlCard = await within(cramQueue)
              .findByTestId(controlCardId);

        expect(controlCard).toBeInTheDocument();
        await removeCram();
        expect(dropCram).toHaveBeenCalled();
        await waitFor(() => expect(cramQueue).toBeEmptyDOMElement());
    });
});

describe("navigation", () => {
    afterAll(jest.clearAllMocks);

    const TestingComponent = () => getNavigationTestingComponent(
        useCards().cram)();
    const renderComponent = getRenderScreen(TestingComponent, credentials);

    test("rendering next page", async () => {
        renderComponent();
        await waitForDataToLoad();
        const clickNext = await screen.findByTestId("click_nextPage");
        fireEvent.click(clickNext);
        
        const card = await screen.findByTestId(
            "c9f2a0ec-fac1-4573-a553-26c5e8d8b5ab");
        expect(card).toBeInTheDocument();
    });

    test("load more", async () => {
        renderComponent();
        await waitForDataToLoad();
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
        renderComponent();
        await waitForDataToLoad();
        const clickPrev = await screen.findByTestId("click_prevPage");
        fireEvent.click(clickPrev);
        const card = await screen.findByTestId(
            "3dc52454-4131-4583-9737-81j6a56ac127");
        expect(card).toBeInTheDocument();
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
            await screen.findByTestId("c9f2a0ec-fac1-4573-a553-26c5e8d8b5ab");
        }).rejects.toEqual(expect.anything());
    });
});

describe("cram queue", () => {
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
                    card => <div key={card.id}
                                  data-testid={card.id}
                                  onClick={() => cram(card)}
                            >
                              <span data-testid="cram-link">
                                {card.cram_link}
                              </span>
                              <span data-testid="card-type">
                                {card.type}
                              </span>
                            </div>)}
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
                    card => <div key={card.id}
                                 data-testid={card.id}>
                              <span data-testid={'successful-review-' + card.id}
                                    onClick={() => reviewCrammed(card, 5)}
                              />
                              <span data-testid={'failed-review-' + card.id}
                                    onClick={() => reviewCrammed(card, 2)}
                              />
                              <span data-testid="card-cramlink">
                                {card.cram_link}
                              </span>
                            </div>)}
              </div>
              <span data-testid="cram-count">
                {cramQueue.count}
              </span>
            </>
        );
    };

    const renderComponent = getRenderScreen(
        CramTestingComponent, credentials);

    test("grading queued card < 4 increases cram count by 1", async () => {
        renderComponent();
        const cramCount = await screen.findByTestId("cram-count");
        const queuedCardId = "5f143904-c9d1-4e5b-ac00-01258d09965a";
        const queuedCards = await screen.findByTestId("queued-cards");
        const queuedCard = await within(queuedCards)
              .findByTestId(queuedCardId);
        fireEvent.click(queuedCard);
        await waitFor(() => expect(cramCount).toHaveTextContent(63));
    });

    test("crammed card successful review", async () => {
        /*
         * card graded > 3 has the cram link dropped,
         * card type in allCards is memorized
         * number of cards in cram is decreased by 1
         */
        // type in allCards is memorized
        // test both all and memorized cards
        renderComponent();
        const cramLink = "/api/users/7cfaec0a-0cc6-4249-8240-b52e40b4da7a/"
        + "cards/cram-queue/5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        const cardById = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        const memorizedCards = await screen.findByTestId("memorized-cards");
        const memorizedCard = await within(memorizedCards)
              .findByTestId(cardById);
        const allCards = await screen.findByTestId("all-cards");
        const cardInAllCards = await within(allCards).findByTestId(cardById);
        const cardInAllCards_cramLink = within(cardInAllCards).getByTestId(
            "cram-link");
        const cardInAllCards_type = within(cardInAllCards).getByTestId(
            "card-type");
        const cramList = await screen.findByTestId("cram-list");
        const memorizedCardInCram = await within(cramList)
              .findByTestId(cardById);
        const cardSuccessfulReview = within(memorizedCardInCram).getByTestId(
            'successful-review-' + cardById);
        const cramCount = await screen.findByTestId("cram-count");

        expect(memorizedCardInCram).toHaveTextContent(cramLink);
        fireEvent.click(cardSuccessfulReview);

        await waitFor(() => expect(cramCount).toHaveTextContent("61"));
        await waitFor(() => expect(memorizedCard)
                      .not.toHaveTextContent(cramLink));
        await waitFor(() => expect(cardInAllCards_cramLink)
                      .not.toHaveTextContent(cramLink));
        await expect(async () => {
            await waitFor(() => expect(cardInAllCards_type)
                          .not.toHaveTextContent("memorized"));
        }).rejects.toEqual(expect.anything());
    });

    test("failed (<4) crammed card review", async () => {
        /* This test is way too long - shall get split 
         * within nested 'describe' block
         */
        // Card is only removed from the cram queue
        // cram link in allCards isn’t removed
        // card has type “memorized” in allCards
        renderComponent();
        const cramLink = "/api/users/7cfaec0a-0cc6-4249-8240-b52e40b4da7a/"
        + "cards/cram-queue/5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        const cardById = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        const memorizedCards = await screen.findByTestId("memorized-cards");
        const memorizedCard = await within(memorizedCards)
              .findByTestId(cardById);
        const allCards = await screen.findByTestId("all-cards");
        const cardInAllCards = await within(allCards).findByTestId(cardById);
        const cardInAllCards_cramLink = within(cardInAllCards).getByTestId(
            "cram-link");
        const cardInAllCards_type = within(cardInAllCards).getByTestId(
            "card-type");
        const cramList = await screen.findByTestId("cram-list");
        const memorizedCardInCram = await within(cramList)
              .findByTestId(cardById);
        const failCardReview = within(memorizedCardInCram).getByTestId(
            'failed-review-' + cardById);
        const cramCount = await screen.findByTestId("cram-count");

        expect(memorizedCardInCram).toHaveTextContent(cramLink);
        fireEvent.click(failCardReview);

        await waitFor(() => expect(memorizedCardInCram)
                      .not.toBeInTheDocument());
        await expect(async () => {
            await waitFor(() => expect(cardInAllCards_cramLink)
                          .not.toHaveTextContent(cramLink));
        }).rejects.toEqual(expect.anything());
        await expect(async () => {
            await waitFor(() => expect(memorizedCard)
                          .not.toHaveTextContent(cramLink));
        }).rejects.toEqual(expect.anything());

        await expect(async () => {
            await waitFor(() => expect(cardInAllCards_type)
                          .not.toHaveTextContent("memorized"));
        }).rejects.toEqual(expect.anything());
        await expect(async () => {
            await waitFor(
                // cram count IS NOT decreased by 1
                () => expect(cramCount).toHaveTextContent("61")
            );
        }).rejects.toEqual(expect.anything());
    });

    test("adding memorized card to cram queue", async () => {
        renderComponent();
        const crammedCardId = "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa";
        const memorizedCards = await screen.findByTestId("memorized-cards");
        const crammedCards = await screen.findByTestId("cram-list");
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
        renderComponent();
        axiosMatch.put.mockClear();

        const cardInCramId = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
        const memorizedCards = await screen.findByTestId("memorized-cards");
        const crammedCards = screen.getByTestId("cram-list");
        const memorizedCardInCram = await within(memorizedCards)
              .findByTestId(cardInCramId);
        fireEvent.click(memorizedCardInCram);
        const cramCount = screen.getByTestId("cram-count");

        expect(axiosMatch.put).not.toHaveBeenCalled();
        await expect(async () => {
            await waitFor(
                // cram count SHOULD NOT be increased by 1
                () => expect(cramCount).toHaveTextContent("63")
            );
        }).rejects.toEqual(expect.anything());
    });

    test("removing card from the cram", async () => {
        renderComponent();
        const crammedCardId = "7cf7ed26-bfd3-45z8-a9fc-a284a86a6bfa";
        const cramList = await screen.findByTestId("cram-list");
        const crammedCard = await within(cramList).findByTestId(
            'successful-review-' + crammedCardId);
        fireEvent.click(crammedCard);
        await waitFor(() => expect(crammedCard).not.toBeInTheDocument());
    });
});
