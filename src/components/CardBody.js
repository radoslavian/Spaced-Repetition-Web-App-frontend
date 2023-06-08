import parse from "html-react-parser";

export default function CardBody({ card, showAnswer = false }) {
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
        <div className="card-body">
          { parse(body, options) }
        </div>
    );
}

