import { useEffect, useState } from "react";
import { UserProvider } from "../contexts/UserProvider";
import { ApiProvider, useApi } from "../contexts/ApiProvider";
import { CategoriesProvider } from "../contexts/CategoriesProvider";
import { CardsProvider } from "../contexts/CardsProvider.js";

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

export function LogInComponent ({children, credentials}) {
    const [loggedIn, setLoggedIn] = useState(false);
    const api = useApi();
    useEffect(() => {
        (async () => {
            await api.authenticate("/auth/token/login/", credentials);
            setLoggedIn(true);
        })();
    }, []);

    // login first into the API
    // then render UserProvider
    return (
        <UserProvider>
          <CategoriesProvider>
            <CardsProvider>
              {children}
            </CardsProvider>
          </CategoriesProvider>
        </UserProvider>
    );
}
