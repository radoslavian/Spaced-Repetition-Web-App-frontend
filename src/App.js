import './App.css';
import { useEffect, useState } from "react";
import useToken from "./hooks/useToken";
import { useApi } from "./contexts/ApiProvider";
import { UserProvider } from './contexts/UserProvider';
import { CategoriesProvider } from "./contexts/CategoriesProvider";
import { CardsProvider } from "./contexts/CardsProvider";
import MainGrid from "./components/MainGrid";
import LoginForm from "./components/LoginForm";

function App() {
    const api = useApi();
    // const appUserName = "simple_user1";
    // const appPassword = "aber45jhdfsfrg";
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({});
    const [authMessage, setAuthMessage] = useState("");
    const { setToken } = useToken();
    const timeout = 500;

    useEffect(() => {
        (async () => {
            if(Object.keys(credentials).length === 0) {
                return;
            }
            setLoading(true);
            const authToken = await api.authenticate(
                "/auth/token/login/", credentials);
            if(Boolean(authToken)) {
                setTimeout(() => {
                    setToken(authToken);
                    setLoading(false);
                }, timeout);
            } else {
                setTimeout(() => {
                    setAuthMessage("Wrong password or username.");
                    setLoading(false);
                }, timeout);
            }
        })();
    }, [api, credentials]);

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
            <LoginForm setCredentials={setCredentials}
                       authMessage={authMessage}
                       loading={loading}/>
    );
}

export default App;
