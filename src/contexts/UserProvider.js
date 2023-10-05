import { createContext, useContext, useState,
         useEffect, useRef } from "react";
import { useApi } from "./ApiProvider";
import useToken from "../hooks/useToken";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authMessages, setAuthMessages] = useState([]);
    const { token, setToken } = useToken();
    const api = useApi();

    useEffect(() => {
        const getUserData = async () => {
            if (api.isAuthenticated()) {
                setUser(undefined);
                const response = await api.get("/auth/users/me/");
                setUser(response !== undefined ? response : null);
            } else {
                setUser(null);
            }
        };
        getUserData();
    }, [api, token]);

    const logIn = async credentials => {
        // this 'if' prevents invalid token stuck in
        // localStorage from being sent to the API (while logging-in)
        // effectively locking the user out of the app
        // and forcing to remove the token manually
        if (token !== null) {
            setToken(null);
        }
        if (authMessages.length !== 0) {
                setAuthMessages([]);
        }
        const response = await api.authenticate(
            "/auth/token/login/", credentials);
        if (response?.status === 400) {
            setAuthMessages(response.data.non_field_errors);
        } else if (typeof(response) === "object") {
            setToken(response);
        } else {
            setAuthMessages(["Server error."]);
        }
    };

    const logOut = async () => {
        await api.logout();
        setToken(null);
    };

    return (
        <UserContext.Provider value={{ user, logIn, logOut, authMessages }}>
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

