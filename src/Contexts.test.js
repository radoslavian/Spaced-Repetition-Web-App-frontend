import { render, act, waitFor, screen, within } from "@testing-library/react";
import { useRef, useEffect } from "react";
import axios, { axiosMatch } from "axios";
import { UserProvider, useUser } from "./contexts/UserProvider";
import { ApiProvider, useApi } from "./contexts/ApiProvider";
import { timeOut } from "./utils/helpers";
import { CategoriesProvider, useCategories } from "./contexts/CategoriesProvider";
import CategorySelector from "./components/CategorySelector.js";

describe("<ApiProvider/>", () => {
    function FakeComponent() {
        const api = useApi();
        const credentials = {user: "user1",
                             password: "passwd"};
        api.authenticate("/auth/token/login/", credentials);
        return (<></>);
    }

    beforeAll(() => {
        render(
            <ApiProvider>
              <FakeComponent/>
            </ApiProvider>
        );
    });

    test("calling authentication route", () => {
        const loginRoute = "http://localhost:8000/api/auth/token/login/";
        expect(axiosMatch.post).toHaveBeenCalledTimes(1);
        expect(axiosMatch.post).toHaveBeenCalledWith(
            {"data":
             {"password": "passwd", "user": "user1"},
             "headers": {"Content-Type": "application/json"},
             "method": "post",
             "url": "http://localhost:8000/api/auth/token/login/"});
    });
});

describe("<UserProvider/>", () => {
    const TestingComponent = () => {
        const api = useApi();
        const credentials = {user: "user1",
                             password: "passwd"};
        api.authenticate("/auth/token/login/", credentials);
        const { user } = useUser();
        return (
            <div>
              <p>{ user?.email }</p>
              <p>{ user?.id }</p>
              <p>{ user?.username }</p>
            </div>
        );
    };

    beforeEach(async () => {
        await act(async () => render(
            <ApiProvider>
              <UserProvider>
                <TestingComponent/>
              </UserProvider>
            </ApiProvider>
        ));
    });

    afterAll(jest.clearAllMocks);

    test("if the component returned user email from the provider", () => {
        const userData = {
            email: "user@userdomain.com.su",
            id: "626e4d32-a52f-4c15-8f78-aacf3b69a9b2",
            username: "django_root"
        };
        const userEmail = screen.getByText("user@userdomain.com.su");
        expect(userEmail).toBeInTheDocument();
    });

    test("if the component returned user id from the provider", () => {
        const userId = screen.getByText(
            "626e4d32-a52f-4c15-8f78-aacf3b69a9b2");
        expect(userId).toBeInTheDocument();
    });

    test("if the component returned username from the provider", () => {
        const userName = screen.getByText("user_name");
        waitFor(() => expect(userName).toBeInTheDocument());
    });
});

describe("<CategoriesProvider/>", () => {
    const TestingComponent = () => {
        const api = useApi();
        const credentials = {user: "user1",
                             password: "passwd"};
        const { categories, selectedCategories,
                setSelectedCategories } = useCategories();
        const called = useRef(false);

        if (!called.current) {
            (async () => {
                await api.authenticate("/auth/token/login/", credentials);
                await timeOut(10);
                setSelectedCategories(
                    ["6d18daff-94d1-489b-97ce-969d1c2912a6"]);
                if (categories != []) {
                    called.current = true;
                }
            })();
        }

        return(<>
                 <div data-testid="test-component-categories">
                   { JSON.stringify(categories) }
                 </div>
                 <div data-testid="test-component-selected-categories">
                   { JSON.stringify(selectedCategories) }
                 </div>
               </>);
    };

    beforeEach(async () => await act(async () => render(
        <ApiProvider>
          <UserProvider>
            <CategoriesProvider>
              <TestingComponent/>
            </CategoriesProvider>
          </UserProvider>
        </ApiProvider>
    )));

    afterAll(jest.clearAllMocks);

    test("if route for downloading categories has been called", () => {
        const route = "http://localhost:8000/api/users/"
              + "626e4d32-a52f-4c15-8f78-aacf3b69a9b2/categories/";
        const options = {"headers":
                         {"Authorization":
                          "Token 7f3371589a52d0ef17877c61d1c82cdf9b7d8f3f",
                          "Content-Type": "application/json"},
                         "method": "get",
                         "url": "http://localhost:8000/api/users/626e4d32-a5"
                         + "2f-4c15-8f78-aacf3b69a9b2/categories/"};

        // once for users.../me, once for obtaining categories
        expect(axiosMatch.get).toHaveBeenCalledTimes(2);
        expect(axiosMatch.get).toHaveBeenCalledWith(options);
    });

    test("if provider returns categories", () => {
        const testedComponent = screen.getByTestId("test-component-categories");
        // arbitrary key - from category "Noun"
        const categoryKey = "506112ea-af69-436e-af1b-64475de40992";
        // arbitrary category title
        const categoryTitle = "Household devices";

        expect(testedComponent).toHaveTextContent(categoryKey);
        expect(testedComponent).toHaveTextContent(categoryTitle);
    });

    test("if provider returns user-selected categories", () => {
        const testedComponent = screen.getByTestId(
            "test-component-selected-categories");
        const categoryKey = "64c3df14-7117-4453-8679-42ebfd18159c";

        expect(testedComponent).toHaveTextContent(categoryKey);
    });

    test("if categories setter called the api", async () => {
        // cumulative number of all api calls in current "describe" block
        await waitFor(() => expect(axiosMatch.put).toHaveBeenCalledTimes(8));
    });
});

