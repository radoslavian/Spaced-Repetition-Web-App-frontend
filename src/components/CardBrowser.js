import { List } from "antd";
import { stripHTMLShortenText } from "../utils/helpers";

export default function CardBrowser({ cards }) {
    const queuedStamp = "[queue]";
    const memorizedStamp = "[mem]";
    const disabledStamp = "[dis]";

    const renderCard = card => {
        const cardClass = card.type || "unkonwn";
        let cardStamp = "";
        let actions = [];

        if (card.type === "queued") {
            cardStamp = queuedStamp;
            actions = [
                <a title="memorize queued card"
                   onClick={card.memorize}>
                  memorize
                </a>,
                <a title="disable queued card"
                   onClick={card.disable}>
                  disable
                </a>
            ];
        }
        else if (card.type === "memorized") {
            cardStamp = memorizedStamp;
            actions = [
                <a title="forget memorized card"
                   onClick={card.forget}>
                  forget
                </a>,
                <a title="cram memorized card"
                   onClick={card.cram}>
                  cram
                </a>,
                <a title="disable memorized card"
                   onClick={card.disable}>
                  disable
                </a>
            ];
        }
        else if (card.type === "disabled") {
            cardStamp = disabledStamp;
            actions = [
                <a title="re-enable disabled card"
                   onClick={card.enable}>
                  enable
                </a>
            ];
        }
        else {
            cardStamp = "[#UNK]";
        }

        return (
            <List.Item
              className={cardClass}
              actions={actions}>
              <span>
                { cardStamp }
              </span>
              { stripHTMLShortenText(card.body) }
            </List.Item>
        );
    };

    return (
        <List
          bordered
          dataSource={cards}
          renderItem={renderCard}
        />
    );
}

