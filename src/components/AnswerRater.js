import { Button } from "antd";

export default function AnswerRater({ card, gradingFn }) {
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
