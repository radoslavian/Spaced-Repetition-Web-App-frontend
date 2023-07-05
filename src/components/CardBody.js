import parse from "html-react-parser";
import { Card, Space } from 'antd';

export default function CardBody({ card, title, showAnswer = false }) {
    const emptyMessage = `<p><b>Empty</b> - looks like there are no more cards
left on this list. Click <b>'Stop'</b> in order to return to the 
greeting screen.</p>`;
    const body = card?.body || emptyMessage;
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
          <div id="card-body"
               data-testid="card-body">
            { parse(body, options) }
          </div>
        </Card>
    );
}

