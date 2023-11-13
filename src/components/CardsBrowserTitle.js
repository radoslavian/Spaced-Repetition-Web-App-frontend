import { Tag } from "antd";

export default function CardsBrowserTitle({ cards }) {
    return (
        <span>
          <Tag color="cyan">{`${cards.count}`} card(s)</Tag>
          in the current set (all cards)
        </span>
    );
}
