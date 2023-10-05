import { useEffect } from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { login, logout } from "axios";
import {  useUser } from "../contexts/UserProvider";
import { UserProvider } from "../contexts/UserProvider";
import { ApiProvider } from "../contexts/ApiProvider";
import { logoutUser } from "../utils/testHelpers";

describe("<UserProvider/>", () => {
    const TestingComponent = ({credentials}) => {
        const { user, logIn, logOut, authMessages } = useUser();

        useEffect(() => {
            if(user === null) { logIn(credentials); }
        }, [user, credentials]);

        return (
            Boolean(user) ?
                <div>
                  <p>{ user?.email }</p>
                  <p>{ user?.id }</p>
                  <p>{ user?.username }</p>
                  <span onClick={ logOut }>
                    click to logout
                  </span>
                </div>
            :
            <>
              <p data-testid="auth-messages">
                { authMessages.map(item => item ) }
              </p>
              <span>logged out</span>
            </>
        );
    };

    jest.spyOn(Storage.prototype, "setItem");
    jest.spyOn(Storage.prototype, "removeItem");

    const defaultCredentials = {user: "user_1",
                                password: "passwd"};
    const wrongCredentials = {user: "wrong_user",
                              password: "wrong_password"};
    const serverFailureCredentials = {user: "server_failure",
                                      password: "failure_password"};

    const renderComponent = (credentials = defaultCredentials) => {
        render(
            <ApiProvider>
              <UserProvider>
                <TestingComponent credentials={credentials}/>
              </UserProvider>
            </ApiProvider>
        );
    };
    afterAll(jest.clearAllMocks);

    // should not run
    test("logOut() - user is set to null", async () => async () => {
        renderComponent();
        const loggedOut = await logoutUser();
        expect(loggedOut).toBeInTheDocument();
    });

    test("logOut() - token gets removed from the Storage", async () => {
        // the actual token removal takes place within
        // useToken - write additional test for that

        renderComponent();
        Storage.prototype.removeItem.mockClear();
        await logoutUser();
        await waitFor(() => expect(localStorage.removeItem)
                      .toHaveBeenCalledTimes(1));
        expect(localStorage.removeItem).toHaveBeenCalledWith("userToken");
    });

    test("if logOut() calls expected route", async () => {
        renderComponent();
        logout.mockClear();
        await logoutUser();
        await waitFor(() => expect(logout).toHaveBeenCalledTimes(1));
    });

    test("if logIn() calls expected route", async () => async () => {
        login.mockClear();
        renderComponent();
        await waitFor(() => expect(login).toHaveBeenCalledTimes(1));
        await logoutUser();
    });

    test("if logIn() saves token to localStorage", async () => async () => {
        renderComponent();
        localStorage.setItem.mockClear();
        await waitFor(() => expect(localStorage.setItem)
                      .toHaveBeenCalledTimes(1));
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "userToken", "\"7f3371589a52d0ef17877c61d1c82cdf9b7d8f3f\"");
        await logoutUser();
    });

    test("if the component returned user email", async () => {
        renderComponent();
        const userData = {
            email: "user@userdomain.com.su",
            id: "626e4d32-a52f-4c15-8f78-aacf3b69a9b2",
            username: "django_root"
        };
        const userEmail = await screen.findByText("user@userdomain.com.su");
        expect(userEmail).toBeInTheDocument();
    });

    test("if the component returned user id from the provider", async() => {
        renderComponent();
        const userId = await screen.findByText(
            "626e4d32-a52f-4c15-8f78-aacf3b69a9b2");
        expect(userId).toBeInTheDocument();
    });

    test("if the component returned username from the provider", async () => {
        renderComponent();
        const userName = await screen.findByText("user_name");
        expect(userName).toBeInTheDocument();
    });

    test("authetincation failure with bad credentials", async () => {
        renderComponent(wrongCredentials);
        const authMessage = await screen.findByTestId("auth-messages");
        const expectedMessage = "Unable to log in with provided credentials.";

        await waitFor(() => expect(authMessage)
                      .toHaveTextContent(expectedMessage));
    });

    test("server failure on authentication attempt", async () => {
        renderComponent(serverFailureCredentials);
        const authMessage = await screen.findByTestId("auth-messages");
        const expectedMessage = "Server error.";

        await waitFor(() => expect(authMessage)
                      .toHaveTextContent(expectedMessage));
    });
});
