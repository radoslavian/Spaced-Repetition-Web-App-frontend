import { PushpinOutlined, HourglassOutlined } from "@ant-design/icons";
import { List, Button } from "antd";
import { cardTextForList } from "../utils/helpers";

const queuedStamp = <>
                      <HourglassOutlined
                        title="queued - not yet memorized" />
                      &nbsp;
                    </>;
const memorizedStamp = <>
                         <PushpinOutlined
                           title="memorized"/>
                         &nbsp;
                       </>;
const disabledStamp = "[dis]";

export default function CardBrowser({ cards, loadMore = f => f, functions }) {
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
                <a title="disable memorized card"
                   onClick={() => disable(card)}>
                  disable
                </a>
            ];
            if (card.cram_link === null) {
                actions.push(
                    <a title="cram memorized card"
                       onClick={() => cram(card)}>
                      cram
                    </a>
                );
            }
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
          <Button type="link"
            onClick={loadMore}>
            load more
          </Button>
        </>
    );
}

