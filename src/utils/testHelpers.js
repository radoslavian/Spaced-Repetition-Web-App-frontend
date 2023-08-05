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
