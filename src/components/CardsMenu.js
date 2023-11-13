import { useState } from "react";
import { Space } from "antd";
import { Button, Dropdown } from "antd";
import DropCramModal from "./DropCramModal";
import { useCards } from "../contexts/CardsProvider.js";
import { MenuOutlined } from '@ant-design/icons';

export default function CardsMenu() {
    const [showDropCramModal, setShowDropCramModal] = useState(false);
    const cards = useCards();
    const { cram } = cards;
    const { dropCram } = cards.functions;
    
    const showModal = () =>  setShowDropCramModal(true);
    const handleClick = ({ key }) => {
        switch(key) {
        case "drop-cram":
            showModal();
            break;
        default:
            console.log("CardsMenu - unknown key: ", key);
        }
    };

    const items = [
        {
            label: "Drop cram",
            key: "drop-cram",
            danger: true,
            disabled: cram.count === 0 ? true : false
        }
    ];
    const menuProps = {
        items,
        onClick: handleClick,
    };

    return (
        <>
          <DropCramModal isModalOpen={showDropCramModal}
                         setModalOpen={setShowDropCramModal}
                         dropFunction={dropCram}/>
          
          <Dropdown menu={menuProps}>
            <Button data-testid="cards-menu">
              <Space>
                <MenuOutlined />
              </Space>
            </Button>
          </Dropdown>
        </>
    );
};

