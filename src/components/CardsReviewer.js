import CardBody from "./CardBody";
import { useState, useEffect } from "react";
import { Button } from "antd";
import AnswerRater from "./AnswerRater";

export default function CardsReviewer({cards, gradingFn, stopReviews = f => f}) {
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        if (cards.isLast === false
            && cards.currentPage.length === 0
            && !cards.isLoading) {
            cards.goToFirst();
        }
    }, [cards.currentPage.length]);
    
    const card = cards.currentPage[0];
    const flipAnswer = () => setShowAnswer(!showAnswer);
    const gradeNFlipCard = async (gradedCard, cardGrade) => {
        await gradingFn(gradedCard, cardGrade);
        flipAnswer();
    };
    const StopButton = () => (<Button data-testid="stop-reviews-trigger"
                                      onClick={stopReviews}>
                                Stop
                              </Button>);
    const bottomBar = (
        card === undefined ?
            <p>No more cards</p>
            :
            showAnswer ?
            <>
              <AnswerRater card={card} gradingFn={gradeNFlipCard}/>
              <StopButton/>
            </>
        :
        <>
          <Button type="primary"
                  id="show-answer-button"
                  data-testid="show-answer-button"
                  onClick={flipAnswer}>
            Show&nbsp;answer
          </Button>
          <StopButton/>
        </>
    );

    return (
        cards.isLoading ?
            <p>Loading</p>
            :
            <>
              <CardBody card={card} showAnswer={showAnswer} />
              { bottomBar }
            </>
    );
}

