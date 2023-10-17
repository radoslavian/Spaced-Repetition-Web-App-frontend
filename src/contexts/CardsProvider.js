import { createContext, useContext, useState,
         useRef, useEffect } from "react";
import { useApi } from "./ApiProvider";
import { useUser } from "./UserProvider";
import { useCategories } from "./CategoriesProvider";
import { checkIfCardIsInList } from "../utils/helpers";

const CardsContext = createContext();

function initNavigation() {
    // object for navigating cards:
    return {
        currentPage: null,
        prev: null,
        next: null
    };
}

export function CardsProvider({ children }) {
    const api = useApi();
    const { user } = useUser();
    const { selectedCategories } = useCategories();

    // memorized
    const [memorizedCards, setMemorizedCards] = useState([]);
    const memorizedCount = useRef(0);
    const memorizedNavigation = useRef(initNavigation());
    const [memorizedIsLoading, setMemorizedLoading] = useState(false);

    // queued
    const [queuedCards, setQueuedCards] = useState([]);
    const queuedCount = useRef(0);
    const queuedNavigation = useRef(initNavigation());
    const [queuedIsLoading, setQueuedLoading] = useState(false);

    // outstanding
    // TODO: all those attributes should be put in an object
    // with a uniform interface
    const [outstandingCards, setOutstandingCards] = useState([]);
    const outstandingCount = useRef(0);
    const outstandingNavigation = useRef({
        current: null,
        prev: null,
        next: null
    });
    const [isOutstandingLoading, setOutstandingLoading] = useState(false);

    // cram queue
    const [cramQueue, setCramQueue] = useState([]);
    const cramQueueCount = useRef(0);
    const cramQueueNavigation = useRef(initNavigation());
    const [isCramLoading, setCramLoading] = useState(false);


    // all cards
    // could this go into a separate hook?
    const [allCards, setAllCards] = useState([]);
    const allCardsCount = useRef(0);
    const allCardsNavigation = useRef(initNavigation());
    const [allCardsIsLoading, setAllCardsLoading] = useState(false);
    const [allCardsSearchedPhrase, setAllCardsSearchedPhrase] = useState("");

    // later this should come from a separate module used by both
    // front-end app and back-end app
    // or: be imported by a backend-app and then stored as a field
    // in a user instance

    // countParam - added due to naming differences of this attribute
    // between endpoint for all cards and the remaining
    const getCards = ({cardsSetter, count, navigation,
                       setIsLoading = f => console.log(
                           "placeholder setIsLoading")}) =>
          async url => {
              setIsLoading(true);
              const response = await api.get(url);
              cardsSetter(response?.results);
              count.current = response["count"];
              navigation.current = {
                  currentPage: url,
                  prev: response.previous,
                  next: response.next
              };
              setIsLoading(false);
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
        // should it check if a card is on the list in the first place?
        // no: presence of a card in a list is checked elsewhere
        const newList = cardList.filter(
            (cardFromList, i) => cardFromList.id !== card.id);
        listSetter(newList);
    };

    const getGoToFirst = (cardsGetter, getUrl) => () => {
        if (user === undefined) {
            return;
        }
        const url = getUrl();
        cardsGetter(url);
    };

    // should I employ useCallback or useMemo for that?
    // memorized
    const getMemorized = getCards({cardsSetter: setMemorizedCards,
                                   count: memorizedCount,
                                   navigation: memorizedNavigation,
                                   setIsLoading: setMemorizedLoading});
    const nextPageMemorized = getNextPage(memorizedNavigation, getMemorized);
    const prevPageMemorized = getPrevPage(memorizedNavigation, getMemorized);

    // queued
    const getQueued = getCards({cardsSetter: setQueuedCards,
                                count: queuedCount,
                                navigation: queuedNavigation,
                                setIsLoading: setQueuedLoading});
    const nextPageQueued = getNextPage(queuedNavigation, getQueued);
    const prevPageQueued = getPrevPage(queuedNavigation, getQueued);

    // cram
    const getCram = getCards({cardsSetter: setCramQueue,
                              count: cramQueueCount,
                              navigation: cramQueueNavigation,
                              setIsLoading: setCramLoading});
    const nextPageCram = getNextPage(cramQueueNavigation, getCram);
    const prevPageCram = getPrevPage(cramQueueNavigation, getCram);

    const getOutstanding = getCards({cardsSetter: setOutstandingCards,
                                     count: outstandingCount,
                                     navigation: outstandingNavigation,
                                     setIsLoading: setOutstandingLoading});

    const nextPageOutstanding = getNextPage(outstandingNavigation,
                                            getOutstanding);
    const prevPageOutstanding = getPrevPage(outstandingNavigation,
                                            getOutstanding);
    const removeFromOutstanding = getRemoveFromList(
        outstandingCards, setOutstandingCards);
    const removeFromCram = getRemoveFromList(cramQueue, setCramQueue);

    const getRemoveCramLinks = (cards, setter) => () => {
        const newCards = cards.map(
            card => card?.cram_link === null ? card
                : {...card, cram_link: null});
        setter(newCards);
    };

    const updateListsRemoveFromCram = card => {
        const setCram = cards => {
            const updatedCard = {
                ...card,
                cram_link: null,
                type: "memorized"
            };
            swapInAllCards(updatedCard);
            swapInMemorized(updatedCard);
            setCramQueue(cards);
        };

        const localRemoveFromCram = getRemoveFromList(cramQueue, setCram);
        localRemoveFromCram(card);
    };

    const removeFromMemorized = getRemoveFromList(
        memorizedCards, setMemorizedCards);

    // all cards
    const getAllCards = getCards({cardsSetter: setAllCards,
                                  count: allCardsCount,
                                  navigation: allCardsNavigation,
                                  setIsLoading: setAllCardsLoading});
    const nextPageAllCards = getNextPage(allCardsNavigation, getAllCards);
    const prevPageAllCards = getPrevPage(allCardsNavigation, getAllCards);

    const getMoreCardsSetter = (cardsList, cardsSetter) => cards => {
        const newCards = cardsList.concat(cards);
        cardsSetter(newCards);
    };

    const getCardsOnLoadMore = (nextPage, loadMore) => async () => {
        if (!Boolean(nextPage)) {
            return;
        }
        loadMore(nextPage);        
    };

    const allCardsMoreSetter = getMoreCardsSetter(allCards, setAllCards);
    const allCardsLoadMore = getCards({cardsSetter: allCardsMoreSetter,
                                       count: allCardsCount,
                                       navigation: allCardsNavigation,
                                       setIsLoading: setAllCardsLoading});
    const allCardsOnLoadMore = getCardsOnLoadMore(
        allCardsNavigation.current.next, allCardsLoadMore);
    const outstandingMoreSetter = getMoreCardsSetter(
        outstandingCards, setOutstandingCards);
    const outstandingLoadMore = getCards(
        {cardsSetter: outstandingMoreSetter,
         count: outstandingCount,
         navigation: outstandingNavigation,
         setIsLoading: setOutstandingLoading});
    const outstandingOnLoadMore = getCardsOnLoadMore(
        outstandingNavigation.current.next, outstandingLoadMore);

    // memorized - loading more cards
    // could this go into a hook?
    const memorizedMoreSetter = getMoreCardsSetter(
        memorizedCards, setMemorizedCards);
    const memorizedLoadMore = getCards(
        {cardsSetter: memorizedMoreSetter,
         count: memorizedCount,
         navigation: memorizedNavigation,
         setIsLoading: setMemorizedLoading});
    const memorizedOnLoadMore = getCardsOnLoadMore(
        memorizedNavigation.current.next, memorizedLoadMore);

    // queued - loading more cards
    const queuedMoreSetter = getMoreCardsSetter(
        queuedCards, setQueuedCards);
    const queuedLoadMore = getCards(
        {cardsSetter: queuedMoreSetter,
         count: queuedCount,
         navigation: queuedNavigation,
         setIsLoading: setQueuedLoading});
    const queuedOnLoadMore = getCardsOnLoadMore(
        queuedNavigation.current.next, queuedLoadMore);

    // cram - loading more cards
    const cramMoreSetter = getMoreCardsSetter(
        cramQueue, setCramQueue);
    const cramLoadMore = getCards(
        {cardsSetter: cramMoreSetter,
         count: cramQueueCount,
         navigation: cramQueueNavigation,
         setIsLoading: setCramLoading});
    const cramOnLoadMore = getCardsOnLoadMore(
        cramQueueNavigation.current.next, cramLoadMore);

    const allCardsUrl = () => {
        if(allCardsSearchedPhrase !== "") {
            const searchQuery = new URLSearchParams(
                {search: allCardsSearchedPhrase});
            return `/users/${user.id}/cards/?${searchQuery}`;
        }
        else {
            return `/users/${user.id}/cards/`;
        }
    };
    const memorizedUrl = () => `/users/${user.id}/cards/memorized/`;
    const queuedUrl = () => `/users/${user.id}/cards/queued/`;
    const outstandingUrl = () =>  `/users/${user.id}/cards/outstanding/`;
    const cramQueueUrl = () => `/users/${user.id}/cards/cram-queue/`;

    // these useEffects should be ultimately reorganized and
    // put into hook returning objects that are listed below
    // (memorized, all, outstanding etc.)
    useEffect(() => {
        if (!api.isAuthenticated() || user === undefined) {
            return;
        }

        getAllCards(allCardsUrl());
        getMemorized(memorizedUrl());
        getQueued(queuedUrl());
        getOutstanding(outstandingUrl());
        // consider changing to this: [user, api, selectedCategories]
    }, [user, api, selectedCategories.length]);

    useEffect(() => {
        if (Boolean(user)) {
            getAllCards(allCardsUrl());
        }
    }, [allCardsSearchedPhrase]);

    useEffect(() => {
        // cram shall be loaded separately since its independent
        // from categories
        if (!api.isAuthenticated() || user === undefined) {
            return;
        }
        getCram(cramQueueUrl());
    }, [user, api]);

    const memorized = {
        currentPage: memorizedCards,
        count: memorizedCount.current,
        isFirst: Boolean(!memorizedNavigation.current.prev),
        isLast: Boolean(!memorizedNavigation.current.next),
        isLoading: memorizedIsLoading,
        nextPage: nextPageMemorized,
        prevPage: prevPageMemorized,
        loadMore: memorizedOnLoadMore,
        goToFirst: getGoToFirst(getMemorized, memorizedUrl)
    };

    const queued = {
        currentPage: queuedCards,
        count: queuedCount.current,
        isFirst: Boolean(!queuedNavigation.current.prev),
        isLast: Boolean(!queuedNavigation.current.next),
        isLoading: queuedIsLoading,
        nextPage: nextPageQueued,
        prevPage: prevPageQueued,
        loadMore: queuedOnLoadMore,
        goToFirst: getGoToFirst(getQueued, queuedUrl)
    };

    const cram = {
        currentPage: cramQueue,
        count: cramQueueCount.current,
        isFirst: Boolean(!cramQueueNavigation.current.prev),
        isLast: Boolean(!cramQueueNavigation.current.next),
        isLoading: isCramLoading,
        nextPage: nextPageCram,
        prevPage: prevPageCram,
        loadMore: cramOnLoadMore,
        goToFirst: getGoToFirst(getCram, cramQueueUrl)
    };

    const outstanding = {
        currentPage: outstandingCards,
        count: outstandingCount.current,
        isFirst: Boolean(!outstandingNavigation.current.prev),
        isLast: Boolean(!outstandingNavigation.current.next),
        isLoading: isOutstandingLoading,
        nextPage: nextPageOutstanding,
        prevPage: prevPageOutstanding,
        loadMore: outstandingOnLoadMore,
        goToFirst: getGoToFirst(getOutstanding, outstandingUrl)
    };

    const all = {
        currentPage: allCards,
        count: allCardsCount.current,
        isFirst: Boolean(!allCardsNavigation.current.prev),
        isLast: Boolean(!allCardsNavigation.current.next),
        isLoading: allCardsIsLoading,
        nextPage: nextPageAllCards,
        prevPage: prevPageAllCards,
        loadMore: allCardsOnLoadMore,
        goToFirst: getGoToFirst(getAllCards, allCardsUrl),
        setSearchedPhrase: setAllCardsSearchedPhrase
    };
    const removeFromQueued = getRemoveFromList(queuedCards, setQueuedCards);

    const getCardSwapper = (cardList, listSetter) => card => {
        // optimization: should check first if card with a given id
        // already is on the list
        // but: some functions check by themselves if card is in a list:
        // forget()
        const newList = cardList.map(
            cardFromList => cardFromList.id === card.id ?
                card : cardFromList);
        listSetter(newList);
    };

    // rudimentary functionality -> expand according to wsra-226
    const getAddTo = (setList, list) => card => setList([...list, card]);

    const addToMemorized = getAddTo(setMemorizedCards, memorizedCards);
    const addToCram = getAddTo(setCramQueue, cramQueue);

    const swapInAllCards = getCardSwapper(allCards, setAllCards);
    const swapInMemorized = getCardSwapper(memorizedCards, setMemorizedCards);

    const functions = {
        memorize: async function(card, grade = 4) {
            // card memorization also means adding it to the cram
            // if grade is < than 4
            if (user === undefined || !api.isAuthenticated()) {
                console.error("Unauthenticated");
                return;
            }
            const url = `/users/${user.id}/cards/queued/${card.id}`;
            const updatedCard = await api.patch(url, {data: {grade: grade}});

            if (updatedCard?.id === undefined) {
                // this should be handled within the ApiClient
                console.error("Failed to memorize card ", card.id);
                return;
            }
            const newCard = {...updatedCard, type: "memorized"};

            if (grade < 4 || Boolean(newCard?.cram_link)) {
                addToCram(newCard);
                cramQueueCount.current++;
            }
            removeFromQueued(card);
            swapInAllCards(newCard);
            addToMemorized(newCard);
            queuedCount.current--;
            memorizedCount.current++;
        },

	cram: async function(card) {
            // TODO: should also check if card isn't already in cram
            // TODO: (has the cram link) - in that case the function
            // should exit
            if (user === undefined || card.cram_link != null) {
                return;
            }
            const url = `/users/${user.id}/cards/cram-queue/`;
            const updatedCard = await api.put(
                url, {data: {"card_pk": card.id}});
            if (updatedCard?.id === undefined) {
                console.error(`Failed to add card ${card.id} to cram queue`);
                return;
            }
            // doesn't replace card - should check first if card isn't
            // already in the list:
            // 1. check if card is in the list
            // if so, don't add
            const newCard = {...updatedCard, type: "memorized"};
            const newList = [...cramQueue, newCard];
            swapInAllCards(newCard);
            setCramQueue(newList);
            cramQueueCount.current++;
        },

        grade: async function(card, grade = 4) {
            if (user === undefined || card?.id === undefined) {
                return;
            }
            const url = `/users/${user.id}/cards/memorized/${card.id}`;
            const updatedCard = await api.patch(url, {data: {grade: grade}});
            removeFromOutstanding(card);

            if (updatedCard?.id === undefined) {
                console.error(`Failed to grade card ${card.id}: `
                              + `${updatedCard?.detail}`);
                return;
            }

            if (grade < 4) {
                const newList = [...cramQueue, updatedCard];
                setCramQueue(newList);
                cramQueueCount.current++;               
            }
            outstandingCount.current--;
        },

        reviewCrammed: async function(card, grade) {
            const minRemoveFromCramGrade = 4;
            if (grade < minRemoveFromCramGrade) {
                removeFromCram(card);
                return;
            } 
            if (user === undefined) {
                return;
            }
            const url = `/users/${user.id}/cards/cram-queue/${card.id}`;

            // 'response' is assigned a value but never used
            const response = await api.delete(url);
            updateListsRemoveFromCram(card);
            cramQueueCount.current--;
        },

        forget: async function(card) {
            if (user === undefined) {
                return;
            }
            const forgetCardUrl = `/users/${user.id}/cards/`
                  + `memorized/${card.id}`;
            const responseDelete = await api.delete(forgetCardUrl);

            if (responseDelete === "") {
                if (checkIfCardIsInList(card, memorizedCards)) {
                    removeFromMemorized(card);
                }
                if (checkIfCardIsInList(card, allCards)) {
                    const queuedCardUrl = `/users/${user.id}`
                          + `/cards/queued/${card.id}`;
                    const queuedCard = await api.get(queuedCardUrl);
                    const queuedCardWithType = {...queuedCard, type: "queued"};
                    swapInAllCards(queuedCardWithType);
                }

                memorizedCount.current--;
                queuedCount.current++;

                if (card.cram_link != null) {
                    cramQueueCount.current--;
                    if (checkIfCardIsInList(card, cramQueue)) {
                        removeFromCram(card);
                    }
                }

                const currentDate = new Date();
                const cardReviewDate = new Date(card.review_date);

                if (cardReviewDate <= currentDate) {
                    outstandingCount.current--;

                    if (checkIfCardIsInList(card, outstandingCards)) {
                        removeFromOutstanding(card);
                    }
                }
            } else if (responseDelete === undefined) {
                // this will never happen - remove in refactoring
                console.error(responseDelete?.detail);
            } else {
                console.error("Failed to forget a card.");
            }
        },

        dropCram: async function() {
            if (user === undefined) {
                return;
            }
            const dropUrl = `/users/${user.id}/cards/cram-queue/`;
            const result = await api.delete(dropUrl);

            if(result === "") {
                cramQueueCount.current = 0;
                setCramQueue([]);
                getRemoveCramLinks(allCards, setAllCards)();
                getRemoveCramLinks(memorizedCards, setMemorizedCards)();
                getRemoveCramLinks(outstandingCards, setOutstandingCards)();
                console.log("dropped");
            }
        },

        disable: async function() {},
	enable: async function() {},
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

