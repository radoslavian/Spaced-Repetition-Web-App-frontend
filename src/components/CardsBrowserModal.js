import { Modal } from "antd";
import { Button } from "antd";

export default function CardsBrowser(
    {title, children, isOpen, closeModal, onClose}) {

    return (
        <Modal title={title}
               centered
               width="600px"
               open={isOpen}
               closable={false}
               footer={[
                   <Button key="Close"
                           onClick={closeModal}>
                     Close
                   </Button>
               ]}>
          { children }
        </Modal>
    );
}

