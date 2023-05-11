import { createContext, useContext, useState,
         useRef, useEffect } from "react";
import { useApi } from "./ApiProvider";
import { useUser } from "./UserProvider";

const CardsContext = createContext();

export function CardsProvider({ children }) {
    const api = useApi();
    const { user } = useUser();
    const [memorizedCards, setMemorizedCards] = useState([]);
    const memorizedCount = useRef(0);
    const memorizedNavigation = useRef({
        current: null,
        prev: null,
        next: null
    });

    // later this should come from a separate module used by both
    // front-end app and back-end app
    // or: be imported by a backend-app and then stored as a field
    // in a user instance
    const cardsPerPage = 20;

    const getCards = (cardsSetter, count, navigation) => {
        return async url => {
            const response = await api.get(url);
            cardsSetter(response?.results);
            count.current = response.count;
            navigation.current = {
                currentPage: url,
                prev: response.previous,
                next: response.next
            };
        };
    };

    const getMemorized = async url => {
        const response = await api.get(url);
        setMemorizedCards(response?.results);
        memorizedCount.current = response.count;
        memorizedNavigation.current = {
            currentPage: url,
            prev: response.previous,
            next: response.next
        };
    };

    const nextPageMemorized = async url => {
        if (Boolean(memorizedNavigation.current.next)) {
            getMemorized(memorizedNavigation.current.next);
        }
    };

    const prevPageMemorized = async url => {
        if (Boolean(memorizedNavigation.current.prev))
            getMemorized(memorizedNavigation.current.prev);
    };

    useEffect(() => {
        if (api.isAuthenticated() && user !== undefined) {
            const url = `/users/${user.id}/cards/memorized/`;
            getMemorized(url);
        }
    }, [user, api]);

    const memorized = {
        currentPage: memorizedCards,
        count: memorizedCount.current,
        isFirst: Boolean(!memorizedNavigation.current.prev),
        isLast: Boolean(!memorizedNavigation.current.next),
        nextPage: nextPageMemorized,
        prevPage: prevPageMemorized
    };

    return (
        <CardsContext.Provider value={{ memorized }}>
          { children }
        </CardsContext.Provider>
    );
}

export function useCards() {
    const cardsContext = useContext(CardsContext);
    if (cardsContext === undefined) {
        throw Error("useCards must be used within CardsProvider");
    }
    return cardsContext;
}

