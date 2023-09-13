import {Row, Col, theme, Layout, Menu } from "antd";
import { useState } from "react";
import CardCategoryBrowser from "./CardCategoryBrowser";
import CardDetails from "./CardDetails";
import CardsSelector from "./CardsSelector";

const { Header, Content, Sider } = Layout;

export default function LearnCardsPage() {
    const gutter = 8;
    const [currentCard, setCurrentCard] = useState(undefined);
    const [cardBody_visible, setCardBody_visible] = useState(true);

    return (<Content>
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
            </Content>);
}
