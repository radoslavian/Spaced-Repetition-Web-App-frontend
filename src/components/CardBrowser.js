import { PushpinOutlined, HourglassOutlined,
         EyeOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";
import { List, Button } from "antd";
import { cardTextForList } from "../utils/helpers";
import CardBody from "./CardBody";
import CardPreviewModal from "./CardPreviewModal";

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
    const { memorize, forget, cram, enable } = functions;
    const previewedCard = useRef(cards[0]);
    const [isCardPreviewOpen, setCardPreviewOpen] = useState(false);

    const openCardPreview = () => setCardPreviewOpen(true);
    const closeCardPreview = () => setCardPreviewOpen(false);

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
            ];
        }
        else if (card.type === "memorized") {
            cardStamp = memorizedStamp;
            actions = [
                <a title="forget memorized card"
                   onClick={() => forget(card)}>
                  forget
                </a>,
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
        actions.push(
            <EyeOutlined title="preview card"
                         onClick={() => {
                             previewedCard.current = card;
                             openCardPreview();
                         }}
            />
        );

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
          <CardPreviewModal data-testid="card-preview-window"
                            card={previewedCard.current}
                            isCardPreviewOpen={isCardPreviewOpen}
                            closeCardPreview={closeCardPreview}/>
          <div id="scrollable-card-list-browser"
                 style={{
                     // found in StackOverflow question:
                     // "How to limit the height of the modal?"
                     maxHeight: "calc(100vh - 225px)",
                     overflow: "auto",
                     padding: '0 16px',
                 }}
            >
          <List
            bordered
            dataSource={cards}
            renderItem={renderCard}
          />
          <Button type="link"
            onClick={loadMore}>
            load more
        </Button>
        </div>
        </>
    );
}

