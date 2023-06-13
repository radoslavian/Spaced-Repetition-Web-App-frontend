import { useCards } from "../contexts/CardsProvider";
import CardsReviewer from "./CardsReviewer";
import { useState } from "react";

export default function CardsSelector() {
    const cards = useCards();
    const { outstanding, cram, queued } = cards;
    const [learnNew, setLearnNew] = useState(false);
    const [isStopped, setStopped] = useState(true);
    const { grade, memorize } = cards.functions;

    const selectCardQueue = () => {
        if(learnNew) {
            return queued;
        }
        for (let cardQueue of [outstanding, cram]) {
            if (cardQueue.currentPage.length !== 0) {
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
        <CardsReviewer cards={currentlyViewedCards}
                       gradingFn={grade}
                       stopReviews={() => setStopped(true)}/>
    );
}
