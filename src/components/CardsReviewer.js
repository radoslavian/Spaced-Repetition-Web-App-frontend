import CardBody from "./CardBody";
import { useState } from "react";
import { Button } from "antd";
import { useCards } from "../contexts/CardsProvider";

function AnswerRater({ card, gradingFn }) {
    const gradeNull = () => gradingFn(card, 0);
    const gradeBad = () => gradingFn(card, 1);
    const gradeFail = () => gradingFn(card, 2);
    const gradePass = () => gradingFn(card, 3);
    const gradeGood = () => gradingFn(card, 4);
    const gradeIdeal = () => gradingFn(card, 5);

    return (
        <div id="grading-buttons">
          <Button type="primary"
                  id="grade-button-null"
                  data-testid="grade-button-null"
                  onClick={gradeNull}>
            Null
          </Button>
          <Button type="primary"
                  id="grade-button-bad"
                  data-testid="grade-button-bad"
                  onClick={gradeBad}>
            Bad
          </Button>
          <Button type="primary"
                  id="grade-button-fail"
                  data-testid="grade-button-fail"
                  onClick={gradeFail}>
            Fail
          </Button>
          <Button type="primary"
                  id="grade-button-pass"
                  data-testid="grade-button-pass"
                  onClick={gradePass}>
            Pass
          </Button>
          <Button type="primary"
                  id="grade-button-good"
                  data-testid="grade-button-good"
                  onClick={gradeGood}>
            Good
          </Button>
          <Button type="primary"
                  id="grade-button-ideal"
                  data-testid="grade-button-ideal"
                  onClick={gradeIdeal}>
            Ideal
          </Button>
        </div>
    );
}

export default function CardsReviewer() {
    const cards = useCards();
    const { outstanding } = cards;
    const { grade } = cards.functions;
    const [showAnswer, setShowAnswer] = useState(false);
    const card = outstanding.currentPage[0];
    const flipAnswer = () => setShowAnswer(!showAnswer);
    const gradeNFlipCard = async (gradedCard, cardGrade) => {
        await grade(gradedCard, cardGrade);
        flipAnswer();
    };
    const bottomBar = (
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
        <>
          <CardBody card={card} showAnswer={showAnswer} />
          { bottomBar }
        </>
    );
}

