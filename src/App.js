import './App.css';
import CategoryBrowser from "./components/CategoryBrowser.js";
import { useEffect, useRef, useState } from "react";
import useToken from "./hooks/useToken";
import { useApi } from "./contexts/ApiProvider";
import { UserProvider } from './contexts/UserProvider';
import { getAuthToken } from "./utils/helpers.js";

function App() {
    const api = useApi();
    const appUserName = "simple_user1";
    const appPassword = "aber45jhdfsfrg";
    const credentials = {
        username: appUserName,
        password: appPassword
    };
    const categories = useRef([]);
    const [selectedCategories, setSelectedCategories] = useState();
    const { token, setToken } = useToken();
    // http://localhost:8000/api/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/categories

    async function getCategories() {
        const url = "/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/categories";
        const categoryData = await api.get(url);
        categories.current = categoryData.categories;
        setSelectedCategories(categoryData.selected_categories);
    }

    useEffect(() => {
        (async () => {
            await api.authenticate("/auth/token/login/", credentials);
            if (api.isAuthenticated()) {
                const token = getAuthToken();
                console.error("Token: ", token);
                getCategories();
                setToken(token);
            }
        })();
    }, []);

    return (
        api.isAuthenticated() ?
        <div className="App">
          <UserProvider>
            <CategoryBrowser
              categories={categories.current}
              selectedCategories={selectedCategories}
            />
          </UserProvider>
        </div> : <p>Unauthenticated</p>
  );
}

export default App;
