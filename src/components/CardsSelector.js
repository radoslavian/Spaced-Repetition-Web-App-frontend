import { Space, Button, Row, Col, Popover, Result } from "antd";
import { useCards } from "../contexts/CardsProvider";
import CardsReviewer from "./CardsReviewer";
import LearningProgress from "./LearningProgress";
import MainDisplay from "./MainDisplay";
import { useState, useEffect, useRef } from "react";

function EmptyQueue({ onClick }){
    return (<div data-testid="no-more-cards-for-review">
              <Result status="success"
                      title="No more items on this list."
                      subTitle="Click to return to the initial screen."
                      extra={
                          <Button type="primary"
                                  onClick={onClick}>
                            Back to the main screen
                          </Button>
                      }/>
            </div>);
}

const scheduledButtonHelp = {
    title: "Learn scheduled cards first",
    content: (
        <div>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br/>
            Nullam eu dui eu erat <b>molestie</b> scelerisque non vel est.</p>
          <p>Mauris pretium aliquam odio, eget ultrices mi ullamcorper in.<br/>
            Sed facilisis pharetra sodales.</p>
        </div>
    )
};

const cramButtonHelp = {
    title: "Review crammed cards",
    content: (
        <div>
          <p>Suspendisse a ornare erat. Pellentesque habitant morbi<br/>
            tristique senectus et netus et malesuada fames ac turpis egestas.</p>
          <p>Donec luctus rutrum est, ut dignissim odio condimentum non.<br/>
            Curabitur consectetur lorem ex, non dignissim arcu faucibus eu.<br/>
            Suspendisse ut purus at augue pellentesque euismod sed sit amet sem.</p>
        </div>
    )
};

const learnNewButtonHelp = {
    title: "Learn cards that haven't been put into learning process yet.",
    content: (
        <div>
          <p>Ut elementum sit amet est nec efficitur.<br/>
            Praesent eget nisi et ipsum maximus pellentesque. Praesent<br/>
            ullamcorper aliquam accumsan.</p>
          <p>Praesent pharetra magna erat, id consequat arcu porttitor eu.<br/>
            Ut placerat varius dolor sit amet consectetur. Nam nec turpis luctus,<br/>
            cursus nulla vitae, porttitor diam.</p>
          <p>Proin in sem scelerisque, rhoncus arcu sit amet, accumsan est.</p>
        </div>
    )
};

function getCardsLeft(obj) {
    return () => {
        // debug
        /*
          console.log(`Obj: isLast: ${obj.cardsList.isLast},
          currentPage.length: ${obj.cardsList.currentPage.length},
          isLoading: ${obj.cardsList.isLoading}`);
        */
        const isEmpty_isNotLoading = (obj.cardsList.currentPage.length === 0
                                      && !obj.cardsList.isLoading);

        return (
            (obj.cardsList.isLast === false && isEmpty_isNotLoading) ||
                (obj.cardsList.count != 0
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
    }, [outstanding, cram, queued]);

    const getReviewCallback = queue => () => {
        selectedQueue.current = queue;
        setStopped(false);
    };

    // button callbacks
    const reviewScheduled = getReviewCallback("outstanding");
    const learnQueued = getReviewCallback("queued");
    const reviewCram = getReviewCallback("crammed");

    return (
        isStopped ?
            <MainDisplay title="Select cards group to learn:">
              <Space direction="vertical"
                     size="large">
                <Popover placement="rightTop"
                         title={scheduledButtonHelp.title}
                         content={scheduledButtonHelp.content}>
                  <Button type="default"
                          size="large"
                          data-testid="learn-all-trigger"
                          onClick={reviewScheduled}>
                    Learn&nbsp;scheduled&nbsp;-&nbsp;{outstanding.count}
                    &nbsp;left
                  </Button>
                </Popover>
                <Popover placement="rightTop"
                         title={cramButtonHelp.title}
                         content={cramButtonHelp.content}>
                  <Button type="default"
                          size="large"
                          data-testid="learn-crammed-trigger"
                          onClick={reviewCram}>
                    Learn&nbsp;from&nbsp;cram&nbsp;-&nbsp;{cram.count}&nbsp;left
                  </Button>
                </Popover>
                <Popover placement="rightTop"
                         title={learnNewButtonHelp.title}
                         content={learnNewButtonHelp.content}>
                  <Button type="dashed"
                          size="large"
                          data-testid="learn-new-trigger"
                          onClick={learnQueued}>
                    Learn&nbsp;new&nbsp;cards&nbsp;-&nbsp;
                    {queued.count}&nbsp;left
                  </Button>
                </Popover>
              </Space>
            </MainDisplay>
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
