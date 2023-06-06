import parse from "html-react-parser";


export default function CardBody({ card }) {
    const body = card?.body || "";
    return (
        <div className="card-body">
          { parse(body) }
        </div>
    );
}

