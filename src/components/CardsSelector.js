import { useCards } from "../contexts/CardsProvider";
import CardsReviewer from "./CardsReviewer";
import { useState } from "react";

export default function CardsSelector() {
    const cards = useCards();
    const { outstanding, cram, queued } = cards;
    const [learnNew, setLearnNew] = useState(false);
    const [isStopped, setStopped] = useState(true);
    const { grade, memorize, removeFromCram } = cards.functions;

    const minRemoveFromCramGrade = 4;

    const removeFromCramQueue = (card, grade) => {
        if (grade >= minRemoveFromCramGrade) {
            removeFromCram(card);
        }
    };

    const crammedCards = {
        cardsList: cram,
        gradingFn: removeFromCramQueue
    };
    const outstandingCards = {
        cardsList: outstanding,
        gradingFn: grade
    };
    const queuedCards = {
        cardsList: queued,
        gradingFn: memorize
    };

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
    const currentlyViewedCards = selectCardQueue();
    
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
        currentlyViewedCards ?
        <CardsReviewer cards={currentlyViewedCards.cardsList}
                       gradingFn={currentlyViewedCards.gradingFn}
                       stopReviews={() => setStopped(true)}/>
        :
        <p data-testid="please-wait-component">Please wait...</p>
    );
}
