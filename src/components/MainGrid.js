import { Col, Row } from "antd";
import CardCategoryBrowser from "./CardCategoryBrowser";
import CardsReviewer from "./CardsReviewer";

export default function MainGrid() {
    return (
        <Row>
          <Col>
            <CardCategoryBrowser/>
          </Col>
          <Col>
            <CardsReviewer/>
          </Col>
        </Row>
    );
}
