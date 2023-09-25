import { useEffect, useState } from "react";
import useToken from "../hooks/useToken";
import { UserProvider } from "../contexts/UserProvider";
import { ApiProvider, useApi } from "../contexts/ApiProvider";
import { CategoriesProvider } from "../contexts/CategoriesProvider";
import { CardsProvider } from "../contexts/CardsProvider.js";
import { useUser } from "../contexts/UserProvider.js";

export function getComponentWithProviders(Component) {
    return () => (<ApiProvider>
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
    const user = useUser();
    return (
        <span data-testid="user-checker">
          { (user === undefined || user === null) ? "undefined" : "user" }
        </span>
    );
}

export function LogInComponent ({children, credentials}) {
    const { token, setToken } = useToken();
    const api = useApi();
    useEffect(() => {
        (async () => {
            const authToken = await api.authenticate(
		"/auth/token/login/", credentials);
            setToken(authToken);
        })();
    }, [api]);

    // login first into the API
    // then render UserProvider
    return (
        <UserProvider>
          <CategoriesProvider>
            <CardsProvider>
              <UserChecker/>
              {children}
            </CardsProvider>
          </CategoriesProvider>
        </UserProvider>
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

    const newMonth = month.length == 1 ? 
        month.padStart('2', '0') : month;
    const newDay = day.length == 1 ? 
        day.padStart('2', '0') : day;
    
    return `${year}-${newMonth}-${newDay}`;
}
