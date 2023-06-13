import { Col, Row } from "antd";
import CardCategoryBrowser from "./CardCategoryBrowser";
import CardsSelector from "./CardsSelector";

export default function MainGrid() {
    return (
        <Row>
          <Col>
              <CardCategoryBrowser/>
          </Col>
          <Col>
            <CardsSelector/>
          </Col>
        </Row>
    );
}
