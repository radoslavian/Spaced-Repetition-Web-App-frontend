import { Button } from "antd";
import { Row, Col } from "antd";

const GradeButton = ({type, id, dataTestId, onClick, children}) => (
    <Button block
            type={type}
            id={id}
            data-testid={dataTestId}
            onClick={onClick}>
    { children }
    </Button>
);

export default function AnswerRater({ card, gradingFn }) {
    const gradeNull = () => gradingFn(card, 0);
    const gradeBad = () => gradingFn(card, 1);
    const gradeFail = () => gradingFn(card, 2);
    const gradePass = () => gradingFn(card, 3);
    const gradeGood = () => gradingFn(card, 4);
    const gradeIdeal = () => gradingFn(card, 5);

    return (
        <Row gutter={1} id="grading-buttons">
          <Col span={4}>
          <GradeButton type="primary"
                  id="grade-button-null"
                  dataTestId="grade-button-null"
                  onClick={gradeNull}>
            Null
        </GradeButton>
          </Col>
          <Col span={4}>
          <GradeButton type="primary"
                  id="grade-button-bad"
                  dataTestId="grade-button-bad"
                  onClick={gradeBad}>
            Bad
        </GradeButton>
          </Col>
          <Col span={4}>
          <GradeButton type="primary"
                  id="grade-button-fail"
                  dataTestId="grade-button-fail"
                  onClick={gradeFail}>
            Fail
        </GradeButton>
          </Col>
          <Col span={4}>
          <GradeButton type="primary"
                  id="grade-button-pass"
                  dataTestId="grade-button-pass"
                  onClick={gradePass}>
            Pass
        </GradeButton>
          </Col>
          <Col span={4}>
          <GradeButton type="primary"
                  id="grade-button-good"
                  dataTestId="grade-button-good"
                  onClick={gradeGood}>
            Good
        </GradeButton>
          </Col>
          <Col span={4}>
          <GradeButton type="primary"
                  id="grade-button-ideal"
                  dataTestId="grade-button-ideal"
                  onClick={gradeIdeal}>
            Ideal
        </GradeButton>
        </Col>
        </Row>
    );
}
