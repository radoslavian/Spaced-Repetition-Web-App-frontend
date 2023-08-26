import { Modal } from "antd";
import { Button } from "antd";
import parse from "html-react-parser";

export default function CardPreviewModal({ card, isCardPreviewOpen,
                                           closeCardPreview })  {
    return (
        <Modal title="Card preview"
               centered
               closable={true}
               data-testid="card-preview-window"
               open={isCardPreviewOpen}
               onCancel={closeCardPreview}
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
}
