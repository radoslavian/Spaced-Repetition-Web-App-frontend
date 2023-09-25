import { Layout } from "antd";
import { useState } from "react";
import CardCategoryBrowser from "./CardCategoryBrowser";
import CardDetails from "./CardDetails";
import CardsSelector from "./CardsSelector";

const {  Content, Sider } = Layout;

export default function LearnCardsPage() {
    const [currentCard, setCurrentCard] = useState(undefined);
    const [cardBody_visible, setCardBody_visible] = useState(true);

    return (
        <Layout>
          <Sider width={280}
                 theme="light">
            <CardCategoryBrowser
              set_cardBody_visible={setCardBody_visible}/>
            <div style={{marginTop: "10px"}}>
              <CardDetails card={currentCard}/>
            </div>
          </Sider>
          <Content>
            <CardsSelector
              setCurrentCard={setCurrentCard}
              displayCardBody={cardBody_visible}/>
          </Content>
        </Layout>
    );
}
