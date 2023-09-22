import CardBody from "./CardBody";
import {Row, Col } from "antd";
import { useState, useEffect } from "react";
import { Button } from "antd";
import AnswerRater from "./AnswerRater";
import { useCategories } from "../contexts/CategoriesProvider";

export default function CardsReviewer(
    {viewedQueue, setCurrentCard = f => f,
     stopReviews = f => f,
     displayCard = true}) {
    const [showAnswer, setShowAnswer] = useState(false);
    const card = viewedQueue?.cardsList.currentPage[0];
    const gradeNFlipCard = async (gradedCard, cardGrade) => {
        await viewedQueue.gradingFn(gradedCard, cardGrade);
        setShowAnswer(false);
    };
    const { selectedCategories } = useCategories();
    const title = viewedQueue?.title;

    useEffect(() => {
        if(showAnswer === true) {
            setShowAnswer(false);
        }
    }, [selectedCategories, card]);

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
                    onClick={() => setShowAnswer(true)}>
              Show&nbsp;answer
            </Button>
          </Col>
          <Col span={4}>
            <StopButton/>
          </Col>
        </Row>
    );

    return (
        Boolean(viewedQueue) && viewedQueue.cardsList.isLoading === true ?
            <p>Loading</p>
            :
        // Workaraound for issue with conflicting css styles.
        // When displaying two cards in a browser:
        //  - one card in CardsReviewer
        //  - another in card-preview modal in cards browser
        // styles from one element overwrite styles in
        // another.

        displayCard === true ? 
            <div style={{textAlign: "left"}}
             id="cards-reviewer">
              <CardBody card={card}
                        title={title}
                        setCurrentCard={setCurrentCard}
                        showAnswer={showAnswer} />
              { bottomBar }
            </div>
        : ""
    );
}

