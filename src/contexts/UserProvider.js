import { createContext, useContext, useState,
         useEffect, useRef } from "react";
import { useApi } from "./ApiProvider";
import useToken from "../hooks/useToken";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const authMessage = useRef("");
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
        const receivedToken = await api.authenticate(
            "/auth/token/login/", credentials);
        if(Boolean(receivedToken)) {
            setToken(receivedToken);
            if (authMessage.current !== "") {
                authMessage.current = "";
            }
        } else {
            authMessage.current = "Authenticaton error. Check credentials.";
        }
    };

    const logOut = async () => {
        await api.logout();
        setToken(null);
    };

    return (
        <UserContext.Provider value={{ user, logIn, logOut, authMessage }}>
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

