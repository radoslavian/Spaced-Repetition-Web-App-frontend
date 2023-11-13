import { Layout, Space } from "antd";
import { useState } from "react";
import CardCategoryBrowser from "./CardCategoryBrowser";
import CardDetails from "./CardDetails";
import CardsSelector from "./CardsSelector";
import CardBrowserModal from "./CardBrowserModal";
import { useCards } from "../contexts/CardsProvider";

const { Content, Sider } = Layout;

export default function LearnCardsPage({set_cardBody_visible}) {
    const [currentCard, setCurrentCard] = useState(undefined);
    const [cardBody_visible, setCardBody_visible] = useState(true);
    const allCards = useCards().all;

    return (
        <Layout>
          <Sider width={280}
                 theme="light"
                 trigger={null}
        /* Update styling (index.css) if 
         * changing breakpoint: */
                 breakpoint="md"
                 collapsedWidth={0}>
            <Space direction="vertical"
                   size="small"
                   style={{ marginTop: "15px" }}>
              <CardCategoryBrowser/>
              <CardBrowserModal cards={allCards}
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
