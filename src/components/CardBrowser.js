import { List, Button } from "antd";
import { cardTextForList } from "../utils/helpers";

export default function CardBrowser({ cards, loadMore = f => f, functions }) {
    const queuedStamp = "[queue]";
    const memorizedStamp = "[mem]";
    const disabledStamp = "[dis]";
    const { memorize, forget, cram, disable, enable } = functions;

    const renderCard = card => {
        const cardClass = card.type || "unkonwn";
        let cardStamp = "";
        let actions = [];

        if (card.type === "queued") {
            cardStamp = queuedStamp;
            actions = [
                <a title="memorize queued card"
                   onClick={() => memorize(card)}>
                  memorize
                </a>,
                <a title="disable queued card"
                   onClick={() => disable(card)}>
                  disable
                </a>
            ];
        }
        else if (card.type === "memorized") {
            cardStamp = memorizedStamp;
            actions = [
                <a title="forget memorized card"
                   onClick={() => forget(card)}>
                  forget
                </a>,
                <a title="cram memorized card"
                   onClick={() => cram(cram)}>
                  cram
                </a>,
                <a title="disable memorized card"
                   onClick={() => disable(card)}>
                  disable
                </a>
            ];
        }
        else if (card.type === "disabled") {
            cardStamp = disabledStamp;
            actions = [
                <a title="re-enable disabled card"
                   onClick={() => enable(card)}>
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
              actions={actions}
              data-testid={card.id}>
              <span>
                { cardStamp }
              </span>
              { cardTextForList(card.body) }
            </List.Item>
        );
    };

    return (
        <>
          <List
            bordered
            dataSource={cards}
            renderItem={renderCard}
          />
          <Button onClick={loadMore}>load more</Button>
        </>
    );
}

