import { render, act, waitFor, screen, within,
         fireEvent } from "@testing-library/react";
import { gradeCard, getQueuedCard } from "axios";
import { ApiProvider } from "../contexts/ApiProvider";
import { useCards } from "../contexts/CardsProvider.js";
import { memorizedCardsSecondPage, memorizedCard,
         queuedCardsMiddlePage,
         cramQueueSecondPage } from "../__mocks__/mockData";
import { getComponentWithProviders,
         getRenderScreen } from "../utils/testHelpers";

describe("<CardsProvider/> - searching all cards", () => {
    const TestingComponent = () => {
        // const { memorized, outstanding, queued, cram, all } = cards;
        const cards = useCards();
        const { searchAll }  = cards;
    };
});

const credentials = {
    user: "user_1",
    password: "passwd"
};

describe("card grading", () => {
    const GradingTestComponent = ({ cardGrade }) => {
        const cards = useCards();
        const { outstanding } = cards;
        const { grade } = cards.functions;
        const cramQueue = cards.cram;

        return (
            <>
              <div data-testid="outstanding-cards">
                { outstanding.currentPage.map(
                    card => <span data-testid={ card.id }
                                  key={ card.id }
                                  onClick={ () => grade(card, cardGrade) }/>) }
              </div>
              <div data-testid="cram-queue">
                { cramQueue.currentPage.map(
                    card => <span data-testid={ card.id }
                                           key={ card.id }/>) }
              </div>
              <span data-testid="outstanding-count">
                { outstanding.count }
              </span>
              <span data-testid="cram-count">
                { cramQueue.count }
              </span>
            </>
        );
    };

    beforeAll(() => jest.spyOn(global.console, "error"));

    test("grade > 3", async () => {
        const renderComponent = getRenderScreen(
            () => <GradingTestComponent cardGrade={4}/>, credentials);
        renderComponent();
        const card = await screen.findByTestId(
            "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa");
        const cramQueue = await screen.findByTestId("cram-queue");
        const outstandingCount = await screen.findByTestId(
            "outstanding-count");
        const cramCount = await screen.findByTestId("cram-count");
        const expectedUrl = "http://localhost:8000/api/users/626e4d32-a52f-4c"
              + "15-8f78-aacf3b69a9b2/cards/memorized/7cf7ed26-bfd2-4"
              + "5a8-a9fc-a284a86a6bfa";
        fireEvent.click(card);

        expect(gradeCard).toHaveBeenCalledTimes(1);
        expect(gradeCard).toHaveBeenCalledWith(
            expect.objectContaining({
                url: expectedUrl,
                method: "patch",
                data: { grade: 4 }
            }));
        // card disapears from the outstanding list
        await waitFor(() => expect(card).not.toBeInTheDocument());
        // cards with grade > 3 don't appear on the cram queue list
        const cardInCram = within(cramQueue).queryByTestId(
            "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa");
        expect(cardInCram).not.toBeInTheDocument();
        // number of outstanding cards is decreased by 1
        expect(outstandingCount).toHaveTextContent(2);
        // cram-count doesn't change
        expect(cramCount).toHaveTextContent("62");
    });

    test("grade < 4", async () => {
        const renderComponent = getRenderScreen(
            () => <GradingTestComponent cardGrade={3}/>, credentials);
        renderComponent();

        const cardId = "7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa";
        const cramCount = await screen.findByTestId("cram-count");
        const outstandingCards = await screen.findByTestId(
            "outstanding-cards");
        const card = await within(outstandingCards).findByTestId(cardId);
        const cramQueue = await screen.findByTestId("cram-queue");
        fireEvent.click(card);

        // cards with grade < 4 should be added to the cram queue list
        const cardInCram = await within(cramQueue).findByTestId(cardId);
        expect(cardInCram).toBeInTheDocument();
        expect(cramCount).toHaveTextContent("63");
        // cram-count is increased by 1
    });

    test("fail: can not grade card scheduled for the future", async () => {
        const renderComponent = getRenderScreen(
            () => <GradingTestComponent cardGrade={2}/>, credentials);
        renderComponent();

        const cardId = "c0320d44-c157-4857-a2b8-39ce89d168f5";
        const errorMessage = "Failed to grade card c0320d44-c157-"
              + "4857-a2b8-39ce89d168f5: Reviewing before card's"
              + " due review date is forbidden.";
        const cramCount = await screen.findByTestId("cram-count");
        const card = await screen.findByTestId(cardId);
        const cramQueue = await screen.findByTestId("cram-queue");
        fireEvent.click(card);

        // current error handling
        console.error.mockClear();
        await waitFor(() => expect(console.error).toBeCalled());
        expect(console.error).toHaveBeenCalledWith(errorMessage);
        // cram count doesn't change
        expect(cramCount).toHaveTextContent("62");
        const cardInCram = within(cramQueue).queryByTestId(cardId);
        expect(cardInCram).not.toBeInTheDocument();
    });
});
