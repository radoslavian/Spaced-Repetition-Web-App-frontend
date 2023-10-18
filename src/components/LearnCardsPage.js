import { Layout, Space, Row, Col } from "antd";
import { useState } from "react";
import CardCategoryBrowser from "./CardCategoryBrowser";
import CardDetails from "./CardDetails";
import CardsSelector from "./CardsSelector";
import CardsMenu from "./CardsMenu";

const { Content, Sider } = Layout;

export default function LearnCardsPage() {
    const [currentCard, setCurrentCard] = useState(undefined);
    const [cardBody_visible, setCardBody_visible] = useState(true);

    return (
        <Layout>
          <Sider width={280}
                 theme="light">
            <Space direction="vertical"
                   size="small"
                   style={{ marginTop: "15px" }}>
              <CardsMenu/>
              <CardCategoryBrowser
                set_cardBody_visible={setCardBody_visible}/>
              <CardDetails card={currentCard}/>
            </Space>
          </Sider>
          <Content style={{backgroundColor: "white"}}>
            <CardsSelector
              setCurrentCard={setCurrentCard}
              displayCardBody={cardBody_visible}/>
          </Content>
        </Layout>
    );
}
