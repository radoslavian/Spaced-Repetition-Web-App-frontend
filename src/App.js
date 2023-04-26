import './App.css';
import CategoryBrowser from "./components/CategoryBrowser.js";
import { useEffect, useRef, useState } from "react";
import useToken from "./hooks/useToken";
import ApiClient from "./utils/APIClient";

function App() {
    const apiClient = new ApiClient();
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

    async function getToken() {
        const endpoint = "/auth/token/login/";
        const localToken = await apiClient.post(endpoint, credentials);
        setToken(localToken);
        apiClient.setAuthToken(localToken.auth_token);
    }

    async function getCategories() {
        const url = "/users/09ee01d5-ade6-48d5-81b8-c5be870fd0c0/categories";
        const categoryData = await apiClient.get(url);
        categories.current = categoryData.categories;
        setSelectedCategories(categoryData.selected_categories);
    }

    useEffect(() => {
        async function setUp() {
            await getToken();
            await getCategories();
        }
        setUp();
    }, []);

 return (
      <div className="App">
        <CategoryBrowser
          categories={categories.current}
          selectedCategories={selectedCategories}
        />
      </div>
  );
}

export default App;
