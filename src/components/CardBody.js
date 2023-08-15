import { Space } from "antd";
import { useEffect } from "react";
import parse from "html-react-parser";
import MainDisplay from "./MainDisplay";
import { removeElementsByClass } from "../utils/helpers";

export default function CardBody({ card, title, setCurrentCard = f => f,
                                   showAnswer = false }) {
    const emptyMessage = "<p><b>Empty</b> - looks like there are "
          + "no more cards "
          + "left on this list. Click <b>'Stop'</b> in order to "
          + "return to the greeting screen.</p>";
    const hiddenClass = "card-answer";
    let body = emptyMessage;
    if(card?.body && !showAnswer) {
        body = removeElementsByClass(card?.body, hiddenClass);
    } else if (card?.body && showAnswer) {
        body = card.body;
    }
    useEffect(() => {
        setCurrentCard(card);
    }, [card]);

    return (
        <MainDisplay title={title}
              testId={card?.id}>
          <div id="card-body"
               data-testid="card-body">
            { parse(body) }
          </div>
        </MainDisplay>
    );
}

