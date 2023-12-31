import { PushpinOutlined, HourglassOutlined,
         EyeOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { List, Button, Tooltip } from "antd";
import { getCardTextForList } from "../utils/helpers";
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

export default function CardList(
    {scrollRef,  cards, loadMore = f => f, functions, entryLen = 30 }) {
    const { memorize, forget, cram, enable } = functions;
    const [previewedCard, setPreviewedCard] = useState(undefined);
    const [isCardPreviewOpen, setCardPreviewOpen] = useState(false);

    const openCardPreview = () => setCardPreviewOpen(true);
    const closeCardPreview = () => setPreviewedCard(undefined);
    const cardTextForList = getCardTextForList(entryLen);
    const TIP_LEN = 70;
    const tipText = getCardTextForList(TIP_LEN);

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
                             setPreviewedCard(card);
                             openCardPreview();
                         }}
            />
        );

        return (
            <Tooltip placement="topLeft"
                     title={ tipText(card.body) }
                     mouseEnterDelay={1}>
              <List.Item
                className={cardClass}
                actions={actions}
                data-testid={card.id}>
                <span>
                  { cardStamp }
                </span>
                { cardTextForList(card.body) }
              </List.Item>
            </Tooltip>
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
            <List style={{minHeight: "25vw"}}
                  dataSource={cards.currentPage}
                  renderItem={renderCard}
            />
            <Button type="default"
                    block
                    onClick={loadMore}
                    data-testid="load-more-button"
                    /* button should get disabled when loading data
                     * or there are no more cards in the list: */
                    disabled={cards.isLoading || cards.isLast}
                    loading={cards.isLoading}
            >
              { cards.isLoading ?
                <span>Loading&hellip;</span> : <span>load more</span> }
            </Button>
          </div>
        </>
    );
}

