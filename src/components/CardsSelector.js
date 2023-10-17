import { Space, Button, Result, Spin } from "antd";
import { useCards } from "../contexts/CardsProvider";
import CardsReviewer from "./CardsReviewer";
import LearningProgress from "./LearningProgress";
import LearnButton from "./LearnButton";
import MainDisplay from "./MainDisplay";
import { useState, useEffect, useRef } from "react";

function EmptyQueue({ onClick }){
    return (
        <div data-testid="no-more-cards-for-review">
          <Result status="success"
                  title="No more items on this list."
                  subTitle="Click to return to the initial screen."
                  extra={
                      <Button type="primary"
                              onClick={onClick}>
                        Back to the main screen
                      </Button>
                  }/>
        </div>
    );
}

const scheduledButtonHelp = {
    title: "Learn scheduled cards first",
    content: (
        <div>
          <p>Start with reviewing cards that are already<br/>
            memorized and scheduled for review (their review<br/>
            date was set for today or earlier).</p>
          <p>If the set is empty (there is no colored badge<br/>
            indicating number of cards), you either have no<br/>
            cards scheduled for today or haven't<br/>
            memorized any yet.</p>
        </div>
    )
};

const cramButtonHelp = {
    title: "Review crammed cards",
    content: (
        <div>
          <p>Cram contains cards that you either failed to<br/>
            recollect on a review, or were given the 'pass'<br/>
            grade (you had some problems when recollecting them).</p>
          <p>By putting cards in cram, you increase likelihood, that<br/>
            you'll recollect them easier/successfully next time you<br/>
            see them.</p>
          <p>You can also put a card in a cram in order to practice with it.</p>
        </div>
    )
};

const learnNewButtonHelp = {
    title: "Learn cards that haven't been put into learning process yet.",
    content: (
        <div>
          <p>If you just started using the app and have no cards<br/>
            memorized yet, this is the place to start: learn new cards<br/>
            in order to place them in a review cycle with increasing intervals.</p>
        </div>
    )
};

function getCardsLeft(obj) {
    return () => {
        const isEmpty_isNotLoading = (obj.cardsList.currentPage.length === 0
                                      && !obj.cardsList.isLoading);

        return (
            (obj.cardsList.isLast === false && isEmpty_isNotLoading) ||
                (obj.cardsList.count !== 0
                 && obj.cardsList.isLast === true
                 && isEmpty_isNotLoading)
        );
    };
};

// setCurrentCard falls to the placeholder too often
export default function CardsSelector({ setCurrentCard = f => f,
                                        displayCardBody = true }) {
    const cards = useCards();
    const selectedQueue = useRef(null);
    const { outstanding, cram, queued } = cards;
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

    const queueSelection = {
        outstanding: outstandingCards,
        crammed: crammedCards,
        queued: queuedCards
    };
    const currentlyViewedQueue = (queueSelection[selectedQueue.current]
                                  || null);
    const emptyQueue = () => (
        currentlyViewedQueue === null ||
            (currentlyViewedQueue.cardsList.count === 0
             && currentlyViewedQueue.cardsList.isLoading === false));

    const outstandingLeft = getCardsLeft(outstandingCards);
    const cramLeft = getCardsLeft(crammedCards);
    const queuedLeft = getCardsLeft(queuedCards);
    const stopReviews = () => {
        setStopped(true);
        setCurrentCard(undefined);
    };

    useEffect(() => {
        if (outstandingLeft()) {
            console.log("CardsSelector - outstanding: goToFirst");
            outstandingCards.cardsList.goToFirst();
        } else if (cramLeft()) {
            console.log("CardsSelector - cram: goToFirst");
            crammedCards.cardsList.goToFirst();
        } else if (queuedLeft()) {
            console.log("CardsSelector - queued: goToFirst");
            queuedCards.cardsList.goToFirst();
        }
    }, [outstanding, cram, queued, cramLeft, crammedCards.cardsList,
        outstandingCards.cardsList, outstandingLeft, queuedCards.cardsList,
        queuedLeft]);

    const getReviewCallback = queue => () => {
        selectedQueue.current = queue;
        setStopped(false);
    };

    // button callbacks
    const reviewScheduled = getReviewCallback("outstanding");
    const learnQueued = getReviewCallback("queued");
    const reviewCram = getReviewCallback("crammed");

    const areCardsLoading = (outstanding?.isLoading === true
                             || cram?.isLoading === true
                             || queued?.isLoading === true);

    return (
        isStopped ?
            <Spin spinning={areCardsLoading}
                  delay={500}
                  tip="Loading cards...">
              <MainDisplay title="Select cards group to learn:">
                <Space direction="vertical"
                       size="large"
                       style={{height: "100%"}}>
                  <LearnButton buttonTitle="Learn&nbsp;scheduled"
                               dataTestId="learn-all-trigger"
                               popoverContent={scheduledButtonHelp}
                               count={outstanding.count}
                               onClick={reviewScheduled}/>
                  <LearnButton buttonTitle="Learn&nbsp;from&nbsp;cram"
                               dataTestId="learn-crammed-trigger"
                               onClick={reviewCram}
                               popoverContent={cramButtonHelp}
                               count={cram.count}
                               badgeColor="gold"/>
                  <LearnButton buttonTitle="Learn&nbsp;new&nbsp;cards"
                               dataTestId="learn-new-trigger"
                               onClick={learnQueued}
                               popoverContent={learnNewButtonHelp}
                               count={queued.count}
                               badgeColor="geekblue"/>
                </Space>
              </MainDisplay>
            </Spin>
        : emptyQueue() ?
            <EmptyQueue onClick={stopReviews}/>
        :
        <div id="cards-reviewer-and-learning-progress">
          <CardsReviewer viewedQueue={currentlyViewedQueue}
                         setCurrentCard={setCurrentCard}
                         stopReviews={stopReviews}
                         displayCard={displayCardBody}/>
          {/* Hide component when CategoryBrowser is visible */}
          { displayCardBody ?
            <LearningProgress scheduled={outstanding.count}
                              cramQueue={cram.count}
                              queued={queued.count}/>
            : "" }
        </div>
    );
}
