import { useState } from "react";
import { Modal, Button } from "antd";
import CardBrowser from "./CardBrowser.js";
import CardsBrowserTitle from "./CardsBrowserTitle.js";

export default function CardBrowserModal(
    {cards, set_cardBody_visible = f => f}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
        set_cardBody_visible(false);
    };
    const onCloseModal = () => {
        cards.setSearchedPhrase("");
        setIsModalOpen(false);
        set_cardBody_visible(true);
    };
    
    return (
        <>
          <Button type="primary"
                  onClick={showModal}>
            Browse all cards
          </Button>
          <Modal title={<CardsBrowserTitle cards={cards}/>}
                 centered
                 width="600px"
                 style={{
                     height: "-webkit-fill-available",
                     transformOrigin: "85px 43px",
                     overflow: "hidden"
                 }}
                 open={isModalOpen}
                 closable={true}
                 onCancel={onCloseModal}
                 footer={[
                     <Button key="Close"
                             onClick={onCloseModal}>
                       Close
                     </Button>
                 ]}>
            <CardBrowser set_cardBody_visible={set_cardBody_visible}
                         cards={cards}/>
          </Modal>
        </>
    );
}

