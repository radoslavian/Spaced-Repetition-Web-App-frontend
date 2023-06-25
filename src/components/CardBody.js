import parse from "html-react-parser";
import { Card, Space } from 'antd';

export default function CardBody({ card, title, showAnswer = false }) {
    const body = card?.body || "<p>Empty</p>";
    const options = showAnswer ? {
        replace: domNode => {
            if (domNode.attribs && domNode.attribs.class === "card-answer") {
                const node = {...domNode};
                node.attribs.class = "card-answer-shown";
                return node;
            }
            return domNode;
        }
    } : {};

    return (
        <Card title={title}
              size="large"
              type="inner"
              data-testid={card?.id}>
          <div id="card-body">
            { parse(body, options) }
          </div>
        </Card>
    );
}

