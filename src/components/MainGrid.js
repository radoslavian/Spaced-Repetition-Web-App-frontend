import {Row, Col, theme, Layout } from "antd";
import { useState } from "react";
import { FolderOpenOutlined } from "@ant-design/icons";
import CardCategoryBrowser from "./CardCategoryBrowser";
import CardsSelector from "./CardsSelector";

const { Content, Sider } = Layout;

export default function MainGrid() {
    const [collapsed, setCollapsed] = useState(true);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const gutter = 8;

    return (
        <>
          <Row gutter={gutter}>
            <Col span={6}>
              <CardCategoryBrowser/>
            </Col>
            <Col span={18}>
              <CardsSelector/>
            </Col>
          </Row>
        </>
    );
}
