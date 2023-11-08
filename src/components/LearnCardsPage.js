import { Layout, Space } from "antd";
import { useState } from "react";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import CardCategoryBrowser from "./CardCategoryBrowser";
import CardDetails from "./CardDetails";
import CardsSelector from "./CardsSelector";
import CardsMenu from "./CardsMenu";

const { Content, Sider } = Layout;

export default function LearnCardsPage() {
    const [currentCard, setCurrentCard] = useState(undefined);
    const [cardBody_visible, setCardBody_visible] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const handleCollapsed = () => setCollapsed(!collapsed);

    const TriggerButton = () => (
        <div style={{ position: "absolute",
                      zIndex: 7,
                      cursor: "pointer",
                      paddingTop: "20px",
                      paddingLeft: "5px" }}
             onClick={handleCollapsed}>
          { collapsed ?
            <RightOutlined title="Expand sider"/>
            :
            <LeftOutlined title="Hide sider"/> }
        </div>
    );

    return (
        <Layout>
          <Sider width={280}
                 theme="light"
                 breakpoint="md"
                 trigger={null}
                 collapsedWidth={0}
                 collapsed={collapsed}
                 onCollapse={handleCollapsed}>
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
            <TriggerButton/>
            <CardsSelector
              setCurrentCard={setCurrentCard}
              displayCardBody={cardBody_visible}/>
          </Content>
        </Layout>
    );
}
