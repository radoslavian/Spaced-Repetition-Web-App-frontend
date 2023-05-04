import { createContext } from "react";
import { useContext } from "react";
import ApiClient from "../utils/APIClient";

export const ApiContext = createContext();

export function ApiProvider({ children }) {
    const api = new ApiClient();
    return (
        <ApiContext.Provider value={ api }>
          {children}
        </ApiContext.Provider>
    );
}

export function useApi() {
    const apiContext = useContext(ApiContext);
    if (apiContext === undefined) {
        throw Error("useApi must be used within ApiProvider");
    }
    return apiContext;
}

