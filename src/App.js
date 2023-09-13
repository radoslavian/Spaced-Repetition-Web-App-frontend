import './App.css';
import { useEffect } from "react";
import useToken from "./hooks/useToken";
import { useApi } from "./contexts/ApiProvider";
import { UserProvider } from './contexts/UserProvider';
import { CategoriesProvider } from "./contexts/CategoriesProvider";
import { CardsProvider } from "./contexts/CardsProvider";
import { getAuthToken } from "./utils/helpers.js";
import MainGrid from "./components/MainGrid";
import { Route, Routes } from "react-router-dom";

function App() {
    const api = useApi();
    const appUserName = "simple_user1";
    const appPassword = "aber45jhdfsfrg";
    const credentials = {
        username: appUserName,
        password: appPassword
    };
    // const { token, setToken } = useToken();

    useEffect(() => {
        (async () => {
            await api.authenticate("/auth/token/login/", credentials);
            if (api.isAuthenticated()) {
                const token = getAuthToken();
                // setToken(token);
            }
        })();
    }, []);

    return (
        api.isAuthenticated() ?
            <div className="App">
              <UserProvider>
                <CategoriesProvider>
                  <CardsProvider>
                    <MainGrid/>
                  </CardsProvider>
                </CategoriesProvider>
              </UserProvider>
            </div>
        :
        <p>
          Api - is authenticated:
          { api.isAuthenticated().toString() }
        </p>

    );
}

export default App;
