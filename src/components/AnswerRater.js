import { Button, Tooltip } from "antd";
import { Row, Col } from "antd";

function GradeButton ({type, id, dataTestId, onClick, children,
                       tooltip /* new */}) {
    const GradeBt = () => (<Button block
                                   type={type}
                                   id={id}
                                   data-testid={dataTestId}
                                   onClick={onClick}>
                             { children }
                           </Button>);

    return (
        Boolean(tooltip) ?
            <Tooltip title={tooltip}>
              <span data-testid={"tooltip-" + id}>
                <GradeBt/>
              </span>
            </Tooltip>
        : <GradeBt/>
    );
};

export default function AnswerRater({ card, gradingFn = () => console.error(
    "AnswerRater: no grading function provided!") }) {
    const gradeNull = () => gradingFn(card, 0);
    const gradeBad = () => gradingFn(card, 1);
    const gradeFail = () => gradingFn(card, 2);
    const gradePass = () => gradingFn(card, 3);
    const gradeGood = () => gradingFn(card, 4);
    const gradeIdeal = () => gradingFn(card, 5);

    const tooltipText = "Approximate next review: ";

    const gradeTooltip = grade => {
        if (card?.projected_review_data) {
            return tooltipText + card
                .projected_review_data[grade]["review_date"];
        }
        return null;
    };

    return (
        <Row gutter={1} id="grading-buttons">
          <Col span={4}>
            <GradeButton type="primary"
                         id="grade-button-null"
                         dataTestId="grade-button-null"
                         tooltip={gradeTooltip("0")}
                         onClick={gradeNull}>
              Null
            </GradeButton>
          </Col>
          <Col span={4}>
            <GradeButton type="primary"
                         id="grade-button-bad"
                         dataTestId="grade-button-bad"
                         tooltip={gradeTooltip("1")}
                         onClick={gradeBad}>
              Bad
            </GradeButton>
          </Col>
          <Col span={4}>
            <GradeButton type="primary"
                         id="grade-button-fail"
                         dataTestId="grade-button-fail"
                         tooltip={gradeTooltip("2")}
                         onClick={gradeFail}>
              Fail
            </GradeButton>
          </Col>
          <Col span={4}>
            <GradeButton type="primary"
                         id="grade-button-pass"
                         dataTestId="grade-button-pass"
                         tooltip={gradeTooltip("3")}
                         onClick={gradePass}>
              Pass
            </GradeButton>
          </Col>
          <Col span={4}>
            <GradeButton type="primary"
                         id="grade-button-good"
                         dataTestId="grade-button-good"
                         tooltip={gradeTooltip("4")}
                         onClick={gradeGood}>
              Good
            </GradeButton>
          </Col>
          <Col span={4}>
            <GradeButton type="primary"
                         id="grade-button-ideal"
                         dataTestId="grade-button-ideal"
                         tooltip={gradeTooltip("5")}
                         onClick={gradeIdeal}>
              Ideal
            </GradeButton>
          </Col>
        </Row>
    );
}
