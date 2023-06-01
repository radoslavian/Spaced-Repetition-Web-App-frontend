import { createContext, useContext, useState,
         useRef, useEffect } from "react";
import { useApi } from "./ApiProvider";
import { useUser } from "./UserProvider";
import { useCategories } from "./CategoriesProvider";

const CardsContext = createContext();

export function CardsProvider({ children }) {
    const api = useApi();
    const { user } = useUser();
    const { selectedCategories } = useCategories();

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

    // cram queue
    const [cramQueue, setCramQueue] = useState([]);
    const cramQueueCount = useRef(0);
    const cramQueueNavigation = useRef({
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

    const getRemoveFromList = (cardList, listSetter) => card => {
        // maybe it should check if a card is on the list in the first place?
        const newList = cardList.filter(
            (cardFromList, i) => cardFromList.id !== card.id);
        listSetter(newList);
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

    // cram
    const getCram = getCards(setCramQueue, cramQueueCount,
                             cramQueueNavigation);
    const nextPageCram = getNextPage(cramQueueNavigation, getCram);
    const prevPageCram = getPrevPage(cramQueueNavigation, getCram);

    // outstanding (scheduled)
    const getOutstanding = getCards(setOutstandingCards, outstandingCount,
                                    outstandingNavigation);
    const nextPageOutstanding = getNextPage(outstandingNavigation,
                                            getOutstanding);
    const prevPageOutstanding = getPrevPage(outstandingNavigation,
                                            getOutstanding);
    const removeFromOutstanding = getRemoveFromList(
        outstandingCards, setOutstandingCards);

    // all cards
    const getAllCards = getCards(setAllCards, allCardsCount,
                                 allCardsNavigation, "overall_total");
    const nextPageAllCards = getNextPage(allCardsNavigation, getAllCards);
    const prevPageAllCards = getPrevPage(allCardsNavigation, getAllCards);

    const allCardsMoreSetter = cards => {
        const newCards = allCards.concat(cards);
        setAllCards(newCards);
    };

    const allCardsLoadMore = getCards(allCardsMoreSetter, allCardsCount,
                                      allCardsNavigation, "overall_total");

    const allCardsOnLoadMore = async () => {
        if (!Boolean(allCardsNavigation.current.next)) {
            return;
        }
        allCardsLoadMore(allCardsNavigation.current.next);
    };

    useEffect(() => {
        if (!api.isAuthenticated() || user === undefined) {
            return;
        }
        const allCardsUrl = `/users/${user.id}/cards/`;
        const memorizedUrl = `/users/${user.id}/cards/memorized/`;
        const queuedUrl = `/users/${user.id}/cards/queued/`;
        const outstandingUrl = `/users/${user.id}/cards/outstanding/`;

        getAllCards(allCardsUrl);
        getMemorized(memorizedUrl);
        getQueued(queuedUrl);
        getOutstanding(outstandingUrl);
    }, [user, api, selectedCategories.length]);

    useEffect(() => {
        // cram shall be loaded separately since its independent
        // from categories
        if (user === undefined) {
            return;
        }
        getCram(`/users/${user.id}/cards/cram-queue/`);
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

    const cram = {
        currentPage: cramQueue,
        count: cramQueueCount.current,
        isFirst: Boolean(!cramQueueNavigation.current.prev),
        isLast: Boolean(!cramQueueNavigation.current.next),
        nextPage: nextPageCram,
        prevPage: prevPageCram
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
        const url = `/users/${user.id}/cards/`;
        getAllCards(url);
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

    const removeFromQueued = getRemoveFromList(queuedCards, setQueuedCards);
    const getCardSwapper = (cardList, listSetter) => card => {
        // optimization: should check first if card with a given id
        // already is on the list
        const newList = cardList.map(
            cardFromList => cardFromList.id === card.id ?
                card : cardFromList);
        listSetter(newList);
    };

    // rudimentary functionality -> expand according to wsra-226
    const addToMemorized = card => setMemorizedCards(
        [...memorizedCards, card]);

    const swapInAllCards = getCardSwapper(allCards, setAllCards);

    const functions = {
        memorize: async function(card, grade = 4) {
            if (user === undefined || !api.isAuthenticated()) {
                console.error("Unauthenticated");
                return;
            }
            const url = `/users/${user.id}/cards/queued/${card.id}`;
            const updatedCard = await api.patch(url, {data: {grade: grade}});

            // if success -> remove card from the queue list
            if (updatedCard?.id === undefined) {
                // this should be handled within the ApiClient
                console.error("Failed to memorize card ", card.id);
                return;
            }
            removeFromQueued(card);
            swapInAllCards(updatedCard);
            addToMemorized(updatedCard);
        },

	cram: async function(card) {
            if (user === undefined) {
                return;
            }
            const url = `/users/${user.id}/cards/cram-queue/${card.id}`;
            const updatedCard = await api.put(url);
            if (updatedCard?.id === undefined) {
                console.error(`Failed to add card ${card.id} to cram queue`);
                return;
            }
            // doesn't replace card - should check first if card isn't
            // already in the list
            const newList = [...cramQueue, updatedCard];
            setCramQueue(newList);
        },

        grade: async function(card, grade = 4) {
            if (user === undefined) {
                return;
            }
            const url = `/users/${user.id}/cards/memorized/${card.id}`;
            const updatedCard = await api.patch(url, {data: {grade: grade}});

            if (updatedCard?.id === undefined) {
                console.error(`Failed to grade card ${card.id}: `
                              + `${updatedCard?.detail}`);
                return;
            }
            removeFromOutstanding(card);

            if (grade < 4) {
                const newList = [...cramQueue, updatedCard];
                setCramQueue(newList);
                cramQueueCount.current++;               
            }
            outstandingCount.current--;
        },
        forget: async function() {},
	disable: async function() {},
	enable: async function() {}
    };

    return (
        <CardsContext.Provider
          value={{ memorized, queued, cram, outstanding, all, functions }}>
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

