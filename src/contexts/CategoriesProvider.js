import { createContext, useContext, useState, useRef,
         useEffect } from "react";
import { useApi } from "./ApiProvider";
import { useUser } from "./UserProvider";
import { timeOut } from "../utils/helpers";
import { getAuthToken } from "../utils/helpers.js";

const CategoriesContext = createContext();

export function CategoriesProvider({ children }) {
    const api = useApi();
    const { user } = useUser();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const categories = useRef([]);

    // send to the server
    const sendAndSetSelectedCategories = async categories => {
        if (user?.id === undefined || !api.isAuthenticated()) {
            // the assumption is a user cannot select anything if
            // either api is unauthenticated or there is no
            // user data - because in such an instance no
            // categories downloading took place
            return;
        }
        const url = `/users/${user.id}/categories/selected/`;
        const response = await api.put(url, {data: categories});
        // here should go error handling
        setSelectedCategories(categories);
    };

    useEffect(() => {
        async function getCategories() {
            const userId = user?.id;
            if (userId === undefined) {
                return;
            }
            const url = `/users/${userId}/categories/`;
            const categoryData = await api.get(url);
            categories.current = categoryData.categories;
            setSelectedCategories(categoryData.selected_categories);
        }

        getCategories();
    }, [user, api]);

    return (
        <CategoriesContext.Provider
          value={{ categories: categories.current,
                   selectedCategories,
                   setSelectedCategories: sendAndSetSelectedCategories }}>
          { children }
        </CategoriesContext.Provider>
    );
}

export function useCategories() {
    const categoriesContext = useContext(CategoriesContext);
    if (categoriesContext === undefined) {
        throw Error("useCategories must be used within CategoriesProvider");
    }
    return categoriesContext;
}

