import CardBody from "./CardBody";
import { useState, useEffect } from "react";
import { Button } from "antd";
import { useCards } from "../contexts/CardsProvider";
import AnswerRater from "./AnswerRater";

export default function CardsReviewer() {
    const cards = useCards();
    const { outstanding } = cards;
    const { grade } = cards.functions;
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        if (outstanding.isLast === false
            && outstanding.currentPage.length === 0
            && !outstanding.isLoading) {
                outstanding.goToFirst();
        }
    }, [outstanding.currentPage.length]);
    
    const card = outstanding.currentPage[0];
    const flipAnswer = () => setShowAnswer(!showAnswer);
    const gradeNFlipCard = async (gradedCard, cardGrade) => {
        await grade(gradedCard, cardGrade);
        flipAnswer();
    };
    const bottomBar = (
        card === undefined ?
            <p>No more cards</p>
        :
        showAnswer ?
            <AnswerRater card={card} gradingFn={gradeNFlipCard}/>
        :
        <Button type="primary"
                  id="show-answer-button"
                  data-testid="show-answer-button"
                  onClick={flipAnswer}>
            Show&nbsp;answer
        </Button>
    );

    return (
        outstanding.isLoading ?
            <p>Loading</p>
        :
        <>
          <CardBody card={card} showAnswer={showAnswer} />
          { bottomBar }
        </>
    );
}

