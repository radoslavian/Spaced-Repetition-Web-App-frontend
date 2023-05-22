import { createContext, useContext, useState,
         useRef, useEffect } from "react";
import { useApi } from "./ApiProvider";
import { useUser } from "./UserProvider";

const CardsContext = createContext();

export function CardsProvider({ children }) {
    const api = useApi();
    const { user } = useUser();

    // memorized
    const [memorizedCards, setMemorizedCards] = useState([]);
    const memorizedCount = useRef(0);
    const memorizedNavigation = useRef({
        current: null,
        prev: null,
        next: null
    });

    // queued
    const [queuedCards, setQueuedCards] = useState([]);
    const queuedCount = useRef(0);
    const queuedNavigation = useRef({
        current: null,
        prev: null,
        next: null
    });

    // outstanding
    const [outstandingCards, setOutstandingCards] = useState([]);
    const outstandingCount = useRef(0);
    const outstandingNavigation = useRef({
        current: null,
        prev: null,
        next: null
    });

    // all cards
    const [allCards, setAllCards] = useState([]);
    const allCardsCount = useRef(0);
    const allCardsNavigation = useRef({
        current: null,
        prev: null,
        next: null
    });

    const allCardsOnLoadMore = async () => {
        if (!Boolean(allCardsNavigation.current.next)) {
            return;
        }
        const url = allCardsNavigation.current.next;
        // cards from next page
        const cards = await api.get(url);
        const newCardList = allCards.concat(cards.results);
        setAllCards(newCardList);
    };

    // later this should come from a separate module used by both
    // front-end app and back-end app
    // or: be imported by a backend-app and then stored as a field
    // in a user instance
    const cardsPerPage = 20;

    // countParam - added due to naming differences of this attribute
    // between endpoint for all cards and the remaining
    const getCards = (cardsSetter, count, navigation,
                      countParam = "count") =>
          async url => {
              const response = await api.get(url);
              cardsSetter(response?.results);
              count.current = response[countParam];
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
    // memorized
    const getMemorized = getCards(setMemorizedCards, memorizedCount,
                                  memorizedNavigation);
    const nextPageMemorized = getNextPage(memorizedNavigation, getMemorized);
    const prevPageMemorized = getPrevPage(memorizedNavigation, getMemorized);

    // queued
    const getQueued = getCards(setQueuedCards, queuedCount, queuedNavigation);
    const nextPageQueued = getNextPage(queuedNavigation, getQueued);
    const prevPageQueued = getPrevPage(queuedNavigation, getQueued);

    // outstanding (scheduled)
    const getOutstanding = getCards(setOutstandingCards, outstandingCount,
                                    outstandingNavigation);
    const nextPageOutstanding = getNextPage(outstandingNavigation,
                                            getOutstanding);
    const prevPageOutstanding = getPrevPage(outstandingNavigation,
                                            getOutstanding);

    // all cards
    const getAllCards = getCards(setAllCards, allCardsCount,
                                 allCardsNavigation, "overall_total");
    const nextPageAllCards = getNextPage(allCardsNavigation, getAllCards);
    const prevPageAllCards = getPrevPage(allCardsNavigation, getAllCards);

    useEffect(() => {
        if (api.isAuthenticated() && user !== undefined) {
            const allCardsUrl = `/users/${user.id}/cards/`;
            const memorizedUrl = `/users/${user.id}/cards/memorized/`;
            const queuedUrl = `/users/${user.id}/cards/queued/`;
            const outstandingUrl = `/users/${user.id}/cards/outstanding/`;

            getAllCards(allCardsUrl);
            getMemorized(memorizedUrl);
            getQueued(queuedUrl);
            getOutstanding(outstandingUrl);
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

    const queued = {
        currentPage: queuedCards,
        count: queuedCount.current,
        isFirst: Boolean(!queuedNavigation.current.prev),
        isLast: Boolean(!queuedNavigation.current.next),
        nextPage: nextPageQueued,
        prevPage: prevPageQueued
    };

    const outstanding = {
        currentPage: outstandingCards,
        count: outstandingCount.current,
        isFirst: Boolean(!outstandingNavigation.current.prev),
        isLast: Boolean(!outstandingNavigation.current.next),
        nextPage: nextPageOutstanding,
        prevPage: prevPageOutstanding
    };

    const allCardsGoToFirst = () => {
        if (user === undefined) {
            return;
        }
        getAllCards(`/users/${user.id}/cards/`);
    };

    const all = {
        currentPage: allCards,
        count: allCardsCount.current,
        isFirst: Boolean(!allCardsNavigation.current.prev),
        isLast: Boolean(!allCardsNavigation.current.next),
        nextPage: nextPageAllCards,
        prevPage: prevPageAllCards,
        loadMore: allCardsOnLoadMore,
        goToFirst: allCardsGoToFirst
    };

    const functions = {
        memorize: async function(cardId, grade) {
            if (user === undefined || !api.isAuthenticated) {
                return;
            }
            const url = `/users/${user.id}/cards/queued/${cardId}`;
            const response = await api.patch(url, {data: {grade: grade}});
            // TODO: add interactions
        }
    };

    return (
        <CardsContext.Provider
          value={{ memorized, queued, outstanding, all, functions }}>
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

