import { useEffect } from "react";
import { UserProvider } from "../contexts/UserProvider";
import { ApiProvider } from "../contexts/ApiProvider";
import { CategoriesProvider } from "../contexts/CategoriesProvider";
import { CardsProvider } from "../contexts/CardsProvider.js";
import { useUser } from "../contexts/UserProvider.js";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";

export async function waitForDataToLoad() {
    // occasionally we have to wait till actual data loads -
    // which could be indicated by the following assertion
    const isLast = await screen.findByTestId("is-last");
    await waitFor(() => expect(isLast).toHaveTextContent("false"));
};

export async function renderComponent_waitForUser(renderComponent) {
    renderComponent();
    // wait for user to log in
    const userName = await screen.findByTestId("user-checker");
    await waitFor(() => expect(userName)
                  .toHaveTextContent("user user_name"));
};


export async function showAnswer() {
    const showAnswer = await screen.findByText("Show answer");
    fireEvent.click(showAnswer);
}

export async function logoutUser() {
    const logOut = await screen.findByText("click to logout");
    fireEvent.click(logOut);
    const loggedOut = await screen.findByText("logged out");
    return loggedOut;
};

function CardsCurrentPage ({ currentPage }) {
    return (
        <>
          { currentPage.map(card => (
              <p key={ card.id }
                 data-testid={ card.id }>
              </p>
          )) }
        </>
    );
}

export function getProviderGeneralTestingComponent (cardsGroup) {
    return () => {
        const { currentPage, count, isFirst, isLast } = cardsGroup;

        return (
            <>
              <span data-testid="is-first">
                { isFirst ? "true" : "false" }
              </span>
              <span data-testid="is-last">
                { isLast ? "true" : "false"}
              </span>
              <span data-testid="count">{ count }</span>
              <CardsCurrentPage
                data-testid="current-page"
                currentPage={currentPage}/>
            </>
        );
    };
}

export function getNavigationTestingComponent(cardsGroup) {
    return () => {
        const { currentPage, prevPage, nextPage, loadMore, goToFirst,
                isFirst, isLast, isLoading } = cardsGroup;

        return (
            <>
              <div data-testid="is-first">
                { isFirst ? "true" : "false" }
              </div>
              <div data-testid="is-last">
                { isLast ? "true" : "false" }
              </div>
              { currentPage !== [] ?
                <>
                  <div data-testid="click_prevPage"
                       onClick={prevPage}>
                    Click for previous page
                  </div>
                  <div data-testid="click_nextPage"
                       onClick={nextPage}>
                    Click for next page
                  </div>
                  <div data-testid="load-more"
                       onClick={loadMore}>
                    Click to load more
                  </div>
                  <div data-testid="go-to-first"
                       onClick={goToFirst}>
                    Go to first page (reset)
                  </div>
                </>
                : "" }
              <div data-testid="page-data">
                { currentPage.map(card => (
                    <p key={card.id} data-testid={card.id}></p>
                )) }
              </div>
              <div data-testid="is-loading">
                { Boolean(isLoading) ? "true" : "false" }
              </div>
            </>
        );
    };
}

export function getRenderScreen(Component, defaultCredentials) {
    return (credentials = defaultCredentials) => render(
        <ApiProvider>
          <UserProvider>
              <LogInComponent credentials={credentials}>
                <Component/>
              </LogInComponent>
          </UserProvider>
        </ApiProvider>
    );
}

export function getComponentWithProviders(Component) {
    return () => (
        <ApiProvider>
          <UserProvider>
            <CategoriesProvider>
              <CardsProvider>
                <Component/>
              </CardsProvider>
            </CategoriesProvider>
          </UserProvider>
        </ApiProvider>
    );
}

function UserChecker() {
    const { user } = useUser();
    return (
        <span data-testid="user-checker">
          { (user === undefined || user === null) ? "undefined"
            : "user " + user.username }
        </span>
    );
}

export function LogInComponent ({children, credentials}) {
    const { user, logIn, logOut } = useUser();
    
    useEffect(() => {
        if(user === null) { logIn(credentials); }
    }, [user]);

    return (
        Boolean(user) ?
            <CategoriesProvider>
              <CardsProvider>
                <p data-testid="username">{ user?.user }</p>
                <UserChecker/>
                <span data-testid="logout-trigger"
                      onClick={ logOut }>
                  click to logout
                </span>
                {children}
              </CardsProvider>
            </CategoriesProvider>
        : <p>logged out</p>
    );
}

export function tomorrow() {
    // got it from: https://www.geeksforgeeks.org/how-to-get-tomorrows-date-
    // in-a-string-format-in-javascript/

    const d = new Date();
    
    d.setDate(d.getDate() + 1);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1);
    const day = String(d.getDate());

    const newMonth = month.length === 1 ? 
          month.padStart('2', '0') : month;
    const newDay = day.length === 1 ? 
          day.padStart('2', '0') : day;
    
    return `${year}-${newMonth}-${newDay}`;
}
