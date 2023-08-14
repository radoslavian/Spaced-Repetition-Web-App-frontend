import { PushpinOutlined, HourglassOutlined,
         EyeOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";
import { List, Button } from "antd";
import { Modal } from "antd";
import parse from "html-react-parser";
import { cardTextForList } from "../utils/helpers";
import CardBody from "./CardBody";

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
    const previewedCard = useRef(cards[0]);
    const [isCardPreviewOpen, setCardPreviewOpen] = useState(false);

    const openCardPreview = () => setCardPreviewOpen(true);
    const closeCardPreview = () => setCardPreviewOpen(false);

    const CardPreviewModal = ({ card }) => (
        <Modal title="Card preview"
               centered
               closable={false}
               data-testid="card-preview-window"
               open={isCardPreviewOpen}
               footer={[
                   <Button onClick={closeCardPreview}>
                     Close
                   </Button>
               ]}>
          <div className="card-preview">
            { card ? parse(card.body) : "" }
          </div>
        </Modal>
    );

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
                            card={previewedCard.current}/>
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

