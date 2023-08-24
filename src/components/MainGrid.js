import {Row, Col, theme, Layout } from "antd";
import { useState, useRef } from "react";
import { FolderOpenOutlined } from "@ant-design/icons";
import CardCategoryBrowser from "./CardCategoryBrowser";
import CardsSelector from "./CardsSelector";
import CardDetails from "./CardDetails";

const { Content, Sider } = Layout;

export default function MainGrid() {
    const [currentCard, setCurrentCard] = useState(undefined);
    const [cardBody_visible, setCardBody_visible] = useState(true);
    const gutter = 8;

    return (
        <>
          <Row gutter={gutter}>
            <Col span={6}>
              <CardCategoryBrowser
                set_cardBody_visible={setCardBody_visible}/>
              <div style={{marginTop: "10px"}}>
                <CardDetails card={currentCard}/>
              </div>
            </Col>
            <Col span={18}>
              <CardsSelector
                setCurrentCard={setCurrentCard}
                displayCardBody={cardBody_visible}/>
            </Col>
          </Row>
        </>
    );
}
