import {Row, Col, theme, Layout } from "antd";
import { useState, useRef } from "react";
import { FolderOpenOutlined } from "@ant-design/icons";
import CardCategoryBrowser from "./CardCategoryBrowser";
import CardsSelector from "./CardsSelector";
import CardDetails from "./CardDetails";

const { Content, Sider } = Layout;

export default function MainGrid() {
    /*
    const currentCard = useRef(undefined);
    const setCurrentCard = card => {
        console.log("setting Card!");
        currentCard.current = card;
    };
    */
    // bad state update
    const [currentCard, setCurrentCard] = useState(undefined);
    const gutter = 8;

    return (
        <>
          <Row gutter={gutter}>
            <Col span={6}>
              <CardCategoryBrowser/>
              <div style={{marginTop: "10px"}}>
                <CardDetails card={currentCard}/>
              </div>
            </Col>
            <Col span={18}>
              <CardsSelector setCurrentCard={setCurrentCard}/>
            </Col>
          </Row>
        </>
    );
}
