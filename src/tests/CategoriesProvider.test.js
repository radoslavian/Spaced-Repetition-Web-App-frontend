import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useEffect } from "react";
import { axiosMatch, categoriesCalls, downloadCards } from "axios";
import { useUser } from "../contexts/UserProvider";
import { CategoriesProvider,
         useCategories } from "../contexts/CategoriesProvider";
import { memorizedCardsSecondPage, memorizedCard,
         queuedCardsMiddlePage,
         cramQueueSecondPage } from "../__mocks__/mockData";
import { ApiProvider } from "../contexts/ApiProvider";
import { UserProvider } from "../contexts/UserProvider";
import { getComponentWithProviders,
         getRenderScreen } from "../utils/testHelpers";

test("if setting categories updates <CardsProvider/>", async () => {
    const CategoriesComponent = () => {
        const { categories, selectedCategories,
                setSelectedCategories } = useCategories();
        const categoryId = "6d18daff-94d1-489b-97ce-969d1c2912a6";
        setSelectedCategories([categoryId]);
    };
    const credentials = {user: "user_1",
                     password: "passwd"};
    const renderCategoriesComponent = getRenderScreen(
        CategoriesComponent, credentials);

    downloadCards.mockClear();
    renderCategoriesComponent();
    await waitFor(() => expect(
        downloadCards).toHaveBeenCalledTimes(3));
});

describe("<CategoriesProvider/>", () => {
    const TestingComponent = () => {
        const { categories, selectedCategories,
                setSelectedCategories } = useCategories();

        return(<>
                 <div data-testid="test-component-categories">
                   { JSON.stringify(categories) }
                 </div>
                 <div data-testid="test-component-selected-categories">
                   { JSON.stringify(selectedCategories) }
                 </div>
                 <span data-testid="set-selected-categories"
                       onClick={() => setSelectedCategories(
                           ["64c3df14-7117-4453-8679-42ebfd18159c"])}>
                   set selected categories
                 </span>
               </>);
    };

    const credentials = {user: "user_1",  // was user1
                         password: "passwd"};

    const LoggedInComponent = () => {
        const { user, logIn, logOut } = useUser();

        useEffect(() => {
            if(user === null) { logIn(credentials); }
        }, [user]);

        return (
            Boolean(user) ?
                <CategoriesProvider>
                  <p data-testid="username">{ user?.user }</p>
                  <span data-testid="logout-trigger"
                        onClick={ logOut }>
                    click to logout
                  </span>
                  <TestingComponent/>
                </CategoriesProvider>
            : <p>logged out</p>
        );
    };

    const ComponentProviders = () => (
        <ApiProvider>
          <UserProvider>
            <LoggedInComponent/>
          </UserProvider>
        </ApiProvider>
    );

    afterAll(jest.clearAllMocks);
    beforeEach(axiosMatch.put.mockClear);

    test("if route for downloading categories has been called", async () => {
        render(<ComponentProviders/>);
        const route = "http://localhost:8000/api/users/"
              + "626e4d32-a52f-4c15-8f78-aacf3b69a9b2/categories/";
        const options = {"headers":
                         {"Authorization":
                          "Token 7f3371589a52d0ef17877c61d1c82cdf9b7d8f3f",
                          "Content-Type": "application/json"},
                         "method": "get",
                         "url": "http://localhost:8000/api/users/626e4d32-a5"
                         + "2f-4c15-8f78-aacf3b69a9b2/categories/"};

        await waitFor(() => expect(categoriesCalls).toHaveBeenCalledTimes(1));
        expect(categoriesCalls).toHaveBeenCalledWith(options);
    });

    test("if provider returns categories", async () => {
        render(<ComponentProviders/>);
        const testedComponent = await screen
              .findByTestId("test-component-categories");
        // arbitrary key - from category "Noun"
        const categoryKey = "506112ea-af69-436e-af1b-64475de40992";
        // arbitrary category title
        const categoryTitle = "Household devices";

        await waitFor(() => expect(testedComponent)
                      .toHaveTextContent(categoryKey));
        await waitFor(() => expect(testedComponent)
                      .toHaveTextContent(categoryTitle));
    });

    test("if provider returns user-selected categories", async () => {
        render(<ComponentProviders/>);
        const testedComponent = await screen.findByTestId(
            "test-component-selected-categories");
        const categoryKey = "64c3df14-7117-4453-8679-42ebfd18159c";

        await waitFor(() => expect(testedComponent)
                      .toHaveTextContent(categoryKey));
    });

    test("if categories setter called the api", async () => {
        render(<ComponentProviders/>);
        const callData = {
            "data": ["64c3df14-7117-4453-8679-42ebfd18159c"],
            "headers": {
                "Authorization": "Token 7f3371589a52d0ef17877c61d1c82cdf9b7d8f3f",
                "Content-Type": "application/json"
            },
            "method": "put",
            "url": "http://localhost:8000/api/users/626e4d32-a52f-4c15-8f78"
                + "-aacf3b69a9b2/categories/selected/"};
        const putCategoriesTrigger = await screen.findByText(
            "set selected categories");
        axiosMatch.put.mockClear();
        fireEvent.click(putCategoriesTrigger);
        await waitFor(() => expect(axiosMatch.put).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(axiosMatch.put).toHaveBeenCalledWith(callData));
    });
});

