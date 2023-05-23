import './App.css';
import { useEffect } from "react";
import CardCategoryBrowser from "./components/CardCategoryBrowser";
import useToken from "./hooks/useToken";
import { useApi } from "./contexts/ApiProvider";
import { UserProvider } from './contexts/UserProvider';
import { CategoriesProvider } from "./contexts/CategoriesProvider";
import { CardsProvider } from "./contexts/CardsProvider";
import { getAuthToken } from "./utils/helpers.js";

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
                <UserProvider>
                  <CategoriesProvider>
                    <CardsProvider>
                      <CardCategoryBrowser/>
                    </CardsProvider>
                  </CategoriesProvider>
                </UserProvider>
              </UserProvider>
            </div> : <p>Api - is authenticated:
                       { api.isAuthenticated().toString() }
                     </p>
  );
}

export default App;
