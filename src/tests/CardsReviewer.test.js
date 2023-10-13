import { useCards } from "../contexts/CardsProvider";
import { useCategories } from "../contexts/CategoriesProvider";
import { render, screen, act, fireEvent,
         waitFor } from "@testing-library/react";
import { getRenderScreen } from "../utils/testHelpers";
import CardsReviewer from "../components/CardsReviewer";
import { outstandingPrevPage } from "../__mocks__/mockData";

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

    const renderScreen = getRenderScreen(Component, {
                     user: "user_1",
                     password: "passwd"
    });

    test("updating selected categories hides the answer", async () => {
        renderScreen();
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

    const cards = {
        currentPage: outstandingPrevPage.results,
        isLoading: true
    };
    const outstandingCards = {
        title: "Cards",
        cardsList: cards,
        gradingFn: () => {}
    };

    const testSpinners = getRenderScreen(
        () => <CardsReviewer viewedQueue={outstandingCards}/>, {
            user: "user_1",
            password: "passwd"
        }
    );

    test("updating categories: show answer button is disabled", async () => {
        // the button should get disabled if
        // viewedQueue.cardsList.isLoading == true
        testSpinners();
        const showAnswerButton = await screen.findByTestId("show-answer-button");
        await waitFor(() => expect(showAnswerButton).toBeDisabled());
    });

    test("if 'Show answer' click displays buttons with marks", async () => {
        renderScreen();
        // expect - grade button was not found
        const showAnswer = await screen.findByText("Show answer");
        expect(showAnswer).toBeInTheDocument();
        await act(() => fireEvent.click(showAnswer));
        const badGrade = await screen.findByTestId("grade-button-bad");
        expect(badGrade).toBeInTheDocument();

    });

    test("if answer field is hidden", async () => {
        renderScreen();
        const question = await screen.findByText("Example card question.");
        await expect(async () => {
            await waitFor(
                () => expect(screen.getByText("Example Card answer."))
                             .toBeInTheDocument()
            );
        }).rejects.toEqual(expect.anything());
    });

    test("if 'Show answer' click displays answer field", async () => {
        renderScreen();
        const showAnswer = await screen.findByText("Show answer");
        fireEvent.click(showAnswer);
        const answer = await screen.findByText("Example Card answer.");
        expect(answer).toBeInTheDocument();
    });

    test("if review process progresses", async () => {
        // Clicking on the grade re-displays the "Show answer" bar,
        // the answer has a "card-answer" class.

        renderScreen();
        const showAnswer = await screen.findByText("Show answer");
        fireEvent.click(showAnswer);
        const idealGrade = await screen.findByTestId("grade-button-ideal");
        fireEvent.click(idealGrade);
        fireEvent.click(await screen.findByText("Show answer"));

        // another card from the list is displayed
        const nextCardText = "Example Card answer from outstanding card.";
        const nextCard = await screen.findByText(nextCardText);
        expect(nextCard).toBeInTheDocument();
    });
});
