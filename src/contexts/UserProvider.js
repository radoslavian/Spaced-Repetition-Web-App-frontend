import { createContext, useContext, useState, useEffect } from "react";
import { useApi } from "./ApiProvider";
import { getAuthToken } from "../utils/helpers.js";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState();
    const api = useApi();
    const token = getAuthToken();

    useEffect(() => {
        const getUserData = async () => {
            if (api.isAuthenticated()) {
                const response = await api.get("/auth/users/me/");
                setUser(response !== undefined ? response : null);
            } else {
                setUser(null);
            }
        };
        getUserData();
    }, [api, token]);

    return (
        <UserContext.Provider value={{ user }}>
          { children }
        </UserContext.Provider>
    );
}

export function useUser() {
    const userContext = useContext(UserContext);
    if (userContext === undefined) {
        throw Error("useUser must be used within UserProvider");
    }
    return userContext;
}

