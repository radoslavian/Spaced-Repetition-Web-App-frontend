import { render, screen, act, fireEvent,
         waitFor } from "@testing-library/react";
import { within } from "@testing-library/dom";
import CategorySelector from "./components/CategorySelector.js";
import { UserProvider, useUser } from "./contexts/UserProvider";
import { CardsProvider, useCards } from "./contexts/CardsProvider";
import { ApiProvider, useApi } from "./contexts/ApiProvider";
import { CategoriesProvider,
         useCategories } from "./contexts/CategoriesProvider";
import CardBrowser from "./components/CardBrowser";
import { userCategories2 as userCategories } from "./__mocks__/mockData";
import CardCategoryBrowser from "./components/CardCategoryBrowser";
import axios, { downloadCards, axiosMatch } from "axios";

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

describe("<CardCategoryBrowser/>", () => {
    beforeEach(async () => {
        await act(async () => render(
            <ApiProvider>
              <UserProvider>
                <CategoriesProvider>
                  <CardsProvider>
                    <CardCategoryBrowser/>
                  </CardsProvider>
                </CategoriesProvider>
              </UserProvider>
            </ApiProvider>
        ));
    });

    test("if component downloads cards from the server", async () => {
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

