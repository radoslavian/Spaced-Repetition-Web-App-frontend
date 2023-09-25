import { PushpinOutlined, HourglassOutlined,
         EyeOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { List, Button } from "antd";
import { cardTextForList } from "../utils/helpers";
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

export default function CardBrowser(
    {scrollRef,  cards, loadMore = f => f, functions }) {
    const { memorize, forget, cram, enable } = functions;
    const [previewedCard, setPreviewedCard] = useState(undefined);
    const [isCardPreviewOpen, setCardPreviewOpen] = useState(false);

    const openCardPreview = () => setCardPreviewOpen(true);
    const closeCardPreview = () => setPreviewedCard(undefined);

    useEffect(() => {
        /* This, together with closeCardPreview, is a workaround
         * for removing card previewed in a CardBrowser list
         * from the DOM before closing the preview (the 'eye' icon) modal.
         * 1. Closing modal callback function actually sets
         *    currently previewedCard to 'undefined'
         * 2. the useEffect gets triggered by the previewedCard
         *    state change and
         * 3. actually closes the modal.
         * -- this has no coverage in tests! --
         */
        if (previewedCard === undefined) {
            setCardPreviewOpen(false);
        }
    }, [previewedCard]);

    const renderCard = card => {
        const cardClass = card.type || "unkonwn";
        let cardStamp = "";
        let actions = [];

        if (card.type === "queued") {
            cardStamp = queuedStamp;
            actions = [
                <a href="/#"
                   title="memorize queued card"
                   onClick={() => memorize(card)}>
                  memorize
                </a>,
            ];
        }
        else if (card.type === "memorized") {
            cardStamp = memorizedStamp;
            actions = [
                <a href="/#"
                   title="forget memorized card"
                   onClick={() => forget(card)}>
                  forget
                </a>,
            ];
            if (card.cram_link === null) {
                actions.push(
                    <a href="/#"
                       title="cram memorized card"
                       onClick={() => cram(card)}>
                      cram
                    </a>
                );
            }
        }
        else if (card.type === "disabled") {
            cardStamp = disabledStamp;
            actions = [
                <a href="/#"
                   title="re-enable disabled card"
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
                             setPreviewedCard(card);
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
                            card={previewedCard}
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
            <div ref={scrollRef}></div>
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

