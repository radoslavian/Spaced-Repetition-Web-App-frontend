import CardBody from "./CardBody";
import {Row, Col } from "antd";
import { useState, useEffect } from "react";
import { Button, Spin } from "antd";
import AnswerRater from "./AnswerRater";
import Suspense from "./Suspense";
import { useCategories } from "../contexts/CategoriesProvider";

export default function CardsReviewer(
    {viewedQueue, setCurrentCard = f => f,
     stopReviews = f => f,
     displayCard = true}) {
    const [showAnswer, setShowAnswer] = useState(false);
    const [grading, setGrading] = useState(false);
    const card = viewedQueue?.cardsList.currentPage[0];

    const gradeNFlipCard = async (gradedCard, cardGrade) => {
        setGrading(true);
        await viewedQueue.gradingFn(gradedCard, cardGrade);
        setGrading(false);
        setShowAnswer(false);
    };
    const { selectedCategories } = useCategories();
    const title = viewedQueue?.title;

    useEffect(() => {
        if(showAnswer === true) {
            setShowAnswer(false);
        }
    }, [selectedCategories, card/*, viewedQueue.cardsList */]);

    const StopButton = () => (
        <Button data-testid="stop-reviews-trigger"
                block danger ghost
                type="primary"
                onClick={stopReviews}>
          Stop
        </Button>
    );

    // const loadingData = (Boolean(viewedQueue)
    //                      && viewedQueue.cardsList.isLoading === true);
    const loadingData = viewedQueue?.cardsList.isLoading === true;

    const BottomBar = () => (
        card === undefined ?
            <StopButton/>
            :
            showAnswer ?
            <Row gutter={1}>
              <Col span={20}>
                <Spin spinning={grading}>
                  <AnswerRater card={card} gradingFn={gradeNFlipCard}/>
                </Spin>
              </Col>
              <Col span={4}>
                <StopButton/>
              </Col>
            </Row>
        :
        <Row gutter={1}>
          <Col span={20}>
            <Button type="primary"
                    disabled={loadingData}
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
        // Workaraound for issue with conflicting css styles.
        // When displaying two cards in a browser:
        //  - one card in CardsReviewer
        //  - another in card-preview modal in cards browser
        // styles from one element overwrite styles in
        // another.
        displayCard === true ?  // <-- workaround
            <div style={{textAlign: "left"}}
                 id="cards-reviewer">
              <Spin size="large"
                    spinning={loadingData}
                    tip="Please wait while loading cards.">
                <CardBody card={card}
                          title={title}
                          setCurrentCard={setCurrentCard}
                          showAnswer={showAnswer}
                          fallbackText=""/>
              </Spin>
              <BottomBar/>
            </div>
        : ""
    );
}

