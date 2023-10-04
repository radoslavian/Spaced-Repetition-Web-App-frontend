import { render, waitFor, screen, within,
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
         getNavigationTestingComponent, getProviderGeneralTestingComponent
       } from "../utils/testHelpers";

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

const credentials = {
    user: "user_1",
    password: "passwd"
};

const renderComponent = getRenderScreen(Component, credentials);

const getForgetter = cardsListId => async cardId => {
    const cardsList = await screen.findByTestId(cardsListId);
    const card = await within(cardsList).findByTestId(cardId);
    fireEvent.click(card);
    return card;
};

const forgetMemorizedCard = getForgetter("memorized-cards");
const forgetQueuedCard = getForgetter("queued-cards");

it("should fail with: card not found", async () => {
    renderComponent();
    const cardId = "4a58594b-1c84-41f5-b4f0-72dc573b6406";
    const errorMessage = "not found";
    const memorizedCount = await screen.findByTestId(
        "number-of-memorized-cards");
    const queuedCount = await screen.findByTestId(
        "number-of-queued-cards");
    console.error.mockClear();
    await forgetQueuedCard(cardId);
    await waitFor(() => expect(console.error).toHaveBeenCalledTimes(1));
    expect(console.error).toHaveBeenCalledWith(errorMessage);

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
    renderComponent();
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
    renderComponent();
    const cardId = "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa";
    const outstandingCards = await screen.findByTestId(
        "outstanding-cards");
    const scheduledCard = await within(outstandingCards).findByTestId(cardId);
    const outstandingCount = await screen.findByTestId(
        "number-of-outstanding-cards");
    await forgetMemorizedCard(cardId);

    // following forgetting, the card is removed from
    // the current page of outstanding cards
    await waitFor(() => expect(scheduledCard).not.toBeInTheDocument());
    await waitFor(() => expect(outstandingCount).toHaveTextContent(2));
});

test("card swapping on the list of all cards", async () => {
    renderComponent();
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
    renderComponent();
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
    renderComponent();
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
    renderComponent();
    // this card has the cram-link
    const cardId = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
    await forgetMemorizedCard(cardId);
    const numberOfCrammedCards = await screen.findByTestId(
        "number-of-crammed-cards");

    await waitFor(() => expect(
        numberOfCrammedCards).toHaveTextContent(61));
});

test("if number of crammed cards isn't decreased by 1", async () => {
    renderComponent();
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
    renderComponent();
    const cardId = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
    const crammedCards = await screen.findByTestId("crammed-cards");
    const card = await within(crammedCards).findByTestId(cardId);
    await forgetMemorizedCard(cardId);

    await waitFor(() => expect(card).not.toBeInTheDocument());
});

test("if number of queued cards is increased by one", async () => {
    renderComponent();
    const cardId = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
    const numberOfQueuedCards = await screen.findByTestId(
        "number-of-queued-cards");
    await forgetMemorizedCard(cardId);

    await waitFor(() => expect(numberOfQueuedCards)
                  .toHaveTextContent("61"));
});

test("if number of memorized cards is decreased by one", async () => {
    renderComponent();
    const cardId = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
    await forgetMemorizedCard(cardId);
    const numberOfMemorizedCards = await screen.findByTestId(
        "number-of-memorized-cards");

    // mockData.memorizedCardsSecondPage.count
    await waitFor(() => expect(numberOfMemorizedCards)
                  .toHaveTextContent("61"));
});

test("the card is removed from the list of memorized cards", async () => {
    renderComponent();
    const cardId = "5b457c11-b751-436c-9cfe-f3f4d173c1ba";
    const memorizedCard = await forgetMemorizedCard(cardId);
    await waitFor(() => expect(memorizedCard).not.toBeInTheDocument());
});

test("calling forgetting route", async () => {
    renderComponent();
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
