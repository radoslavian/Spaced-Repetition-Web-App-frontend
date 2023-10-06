import { useState } from "react";
import { Space } from "antd";
import { Button, Dropdown } from "antd";
import DropCramModal from "./DropCramModal";
import { useCards } from "../contexts/CardsProvider.js";
import { MenuOutlined } from '@ant-design/icons';

const items = [
    {
        label: "Drop cram",
        key: "drop-cram",
        danger: true
    }
];

export default function CardsMenu() {
    const [showDropCramModal, setShowDropCramModal] = useState(false);
    const { dropCram } = useCards().functions;
    const showModal = () =>  setShowDropCramModal(true);
    const handleClick = ({ key }) => {
        switch(key) {
        case "drop-cram":
            showModal();
            break;
        default:
            console.log("Unknown key: ", key);
        }
    };
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
                <MenuOutlined />Menu
              </Space>
            </Button>
        </Dropdown>
        </>
    );
};

