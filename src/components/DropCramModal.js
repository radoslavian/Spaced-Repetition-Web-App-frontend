import { useState } from "react";
import { Button, Modal } from "antd";

export default function DropCramModal(
    { isModalOpen = false, setModalOpen = () => {},
      dropFunction = () => {} }) {
    const showModal = () => setModalOpen(true);
    const handleDropCram = () => {
        dropFunction();
        setModalOpen(false);
    };
    const handleCancel = () => setModalOpen(false);

    return (
        <Modal title="Confirm dropping cram"
               data-testid="drop-cram-confirmation-dialog"
               open={isModalOpen}
               onCancel={handleCancel}
               footer={[
                   <Button key="cancel"
                           onClick={handleCancel}>
                     Cancel
                   </Button>,
                   <Button key="drop-cram"
                           onClick={handleDropCram}>
                     Drop cram
                   </Button>
               ]}>
          Are you really sure to remove cards from the cram queue?
        </Modal>
    );
}
