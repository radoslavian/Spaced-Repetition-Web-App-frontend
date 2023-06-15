import { useCards } from "../contexts/CardsProvider";
import CardsReviewer from "./CardsReviewer";
import { useState, useEffect } from "react";

export default function CardsSelector() {
    const cards = useCards();
    const { outstanding, cram, queued } = cards;
    const [learnNew, setLearnNew] = useState(false);
    const [isStopped, setStopped] = useState(true);
    const { grade, memorize, reviewCrammed } = cards.functions;

    const crammedCards = {
        title: "Crammed cards",
        cardsList: cram,
        gradingFn: reviewCrammed
    };
    const outstandingCards = {
        title: "Outstanding cards",
        cardsList: outstanding,
        gradingFn: grade
    };
    const queuedCards = {
        title: "Queued cards",
        cardsList: queued,
        gradingFn: memorize
    };
    console.log(cram);

    const getChecker = obj => (obj.cardsList.isLast
                               && obj.cardsList.currentPage.length === 0);
    const outstandingChecker = getChecker(outstandingCards);
    const cramChecker = getChecker(crammedCards);
    const queuedChecker = getChecker(queuedCards);
    console.log("entering useEffect ",
            outstandingCards.cardsList.isLast);
    useEffect(() => {
        console.log("entering useEffect ",
                   outstandingCards.cardsList.isLast);
        if (outstandingChecker) {
            console.log("CardsSelector: goToFirst");
            outstandingCards.cardsList.goToFirst();
        }
    }, [outstanding.length]);

    useEffect(() => {
        console.log("entering useEffect: crammed-isLast ",
                    crammedCards.cardsList.isLast);
        console.log("entering useEffect: crammed-isLoading ",
                    crammedCards.cardsList.isLoading);
        if (cramChecker) {
            console.log("CardsSelector: goToFirst");
            crammedCards.cardsList.goToFirst();
        }
    }, [crammedCards.length]);

    const selectCardQueue = () => {
        if(learnNew) {
            return queuedCards;
        }
        for (let cardQueue of [outstandingCards, crammedCards]) {
            if (cardQueue.cardsList.currentPage.length !== 0) {
                return cardQueue;
            }
        }
        // here: ask to learn new and setLearnNew(true)
        return null;
    };
    const currentlyViewedQueue = selectCardQueue();
    
    return (
        isStopped ?
            <>
              <p data-testid="learn-all-trigger"
                 onClick={() => {
                     if(learnNew) {
                         setLearnNew(false);
                     }
                     setStopped(false);
                 }}>
                Learn scheduled
              </p>
              {/* shall be disabled if the 'queued' is empty */}
              <p data-testid="learn-new-trigger"
                 onClick={() => {
                     if(!learnNew) {
                         setLearnNew(true);
                     }
                     setStopped(false);
                 }}>
                Learn new cards
              </p>
            </>
        :
        currentlyViewedQueue ?
        <CardsReviewer cards={currentlyViewedQueue.cardsList}
                       gradingFn={currentlyViewedQueue.gradingFn}
                       title={currentlyViewedQueue.title}
                       stopReviews={() => setStopped(true)}/>
        :
        <p data-testid="please-wait-component">Please wait...</p>
    );
}
