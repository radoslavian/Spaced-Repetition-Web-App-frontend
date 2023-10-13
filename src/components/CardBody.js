import { useEffect, useRef } from "react";
import parse from "html-react-parser";
import PlayAudio from "./PlayAudio";
import MainDisplay from "./MainDisplay";
import { removeElementsByClass } from "../utils/helpers";

const fallbackEmpty = "<p><b>Empty</b> - looks like there are "
          + "no more cards "
          + "left on this list. Click <b>'Stop'</b> in order to "
          + "return to the greeting screen.</p>";

export default function CardBody(
    { card, title, setCurrentCard = f => f,
      showAnswer = false, fallbackText = fallbackEmpty }) {
    const hiddenClass = "card-answer";
    const body = useRef(fallbackText);

    if(Boolean(card?.body)) {
        if(showAnswer) {
            body.current = card.body;
        } else {
            body.current = removeElementsByClass(card?.body, hiddenClass);
        };
    } else {
        body.current = fallbackText;
    }

    useEffect(() => {
        setCurrentCard(card);
    }, [card]);

    return (
        <MainDisplay title={title}
                     testId={card?.id}>
          <div id="card-body"
               data-testid="card-body">
            { Boolean(card?.front_audio) ?
              <PlayAudio url={card.front_audio}/>
              : "" }
            { parse(body.current) }
            { (Boolean(card?.back_audio) && showAnswer) ?
                <PlayAudio url={card.back_audio}/>
              : "" }
          </div>
        </MainDisplay>
    );
}

