import CardBody from "./CardBody";
import {Row, Col } from "antd";
import { useState, useEffect } from "react";
import { Button } from "antd";
import AnswerRater from "./AnswerRater";
import { useCategories } from "../contexts/CategoriesProvider";

export default function CardsReviewer(
    {cards, gradingFn, stopReviews = f => f, title}) {
    const [showAnswer, setShowAnswer] = useState(false);
    const card = cards.currentPage[0];
    const flipAnswer = () => setShowAnswer(!showAnswer);
    const gradeNFlipCard = async (gradedCard, cardGrade) => {
        await gradingFn(gradedCard, cardGrade);
        flipAnswer();
    };
    const { selectedCategories } = useCategories();

    useEffect(() => {
        if(showAnswer === true) {
            setShowAnswer(false);
        }
    }, [selectedCategories]);

    const StopButton = () => (<Button data-testid="stop-reviews-trigger"
                                      block danger ghost
                                      type="primary"
                                      onClick={stopReviews}>
                                Stop
                              </Button>);
    const bottomBar = (
        card === undefined ?
            <StopButton/>
            :
            showAnswer ?
            <Row gutter={1}>
              <Col span={20}>
                <AnswerRater card={card} gradingFn={gradeNFlipCard}/>
              </Col>
              <Col span={4}>
                <StopButton/>
              </Col>
            </Row>
        :
        <Row gutter={1}>
          <Col span={20}>
            <Button type="primary"
                    block
                    id="show-answer-button"
                    data-testid="show-answer-button"
                    onClick={flipAnswer}>
              Show&nbsp;answer
            </Button>
          </Col>
          <Col span={4}>
            <StopButton/>
          </Col>
        </Row>
    );

    return (
        cards.isLoading === true ?
            <p>Loading</p>
            :
            <div style={{textAlign: "left"}}>
              <CardBody card={card}
                        title={title}
                        showAnswer={showAnswer} />
              { bottomBar }
            </div>
    );
}

