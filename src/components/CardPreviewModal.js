import { Modal, Button, Tabs } from "antd";
import parse from "html-react-parser";
import CardDetails from "./CardDetails";

export default function CardPreviewModal({ card, isCardPreviewOpen,
                                           closeCardPreview })  {
    const cardPreviewTab = (
        <div className="card-preview">
          { card ? parse(card.body) : "" }
        </div>
    );
    const cardDetailsTab = <CardDetails card={card}/>;
    const items = [
        {
            key: "card_preview",
            label: "Card preview",
            children: cardPreviewTab
        },
        {
            key: "card_details",
            label: "Details",
            children: cardDetailsTab
        }
    ];
    
    return (
        <Modal centered
               closable={true}
               data-testid="card-preview-window"
               open={isCardPreviewOpen}
               onCancel={closeCardPreview}
               footer={[
                   <Button onClick={closeCardPreview}>
                     Close
                   </Button>
               ]}>
          <Tabs defaultActiveKey="card_preview" items={items}/>
        </Modal>
    );
}
