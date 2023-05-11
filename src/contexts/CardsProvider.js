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

    const getCards = (cardsSetter, count, navigation) =>
          async url => {
              const response = await api.get(url);
              cardsSetter(response?.results);
              count.current = response.count;
              navigation.current = {
                  currentPage: url,
                  prev: response.previous,
                  next: response.next
              };
          };

    const getNextPage = (navigation, getCardsFn) => 
          async () => {
              if (Boolean(navigation.current.next)) {
                  getCardsFn(navigation.current.next);
              }
          };

    const getPrevPage = (navigation, getCardsFn) =>
          async () => {
              if (Boolean(navigation.current.prev)) {
                  getCardsFn(navigation.current.prev);
              }
          };

    // should I employ useCallback or useMemo for that?
    const getMemorized = getCards(setMemorizedCards,
                                  memorizedCount, memorizedNavigation);
    const nextPageMemorized = getNextPage(memorizedNavigation, getMemorized);
    const prevPageMemorized = getPrevPage(memorizedNavigation, getMemorized);

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

