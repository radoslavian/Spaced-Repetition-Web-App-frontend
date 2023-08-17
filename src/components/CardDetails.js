import { Descriptions } from "antd";
import { extractDate } from "../utils/helpers";

export default function CardDetails({card}) {
    return (
        Boolean(card?.easiness_factor) ?
            <Descriptions title="Card details"
                          layout="horizontal"
                          size="small"
                          bordered
                          column={1}
                          data-testid="card-details">
              <Descriptions.Item label="Computed interval">
                { card["computed_interval"] }
              </Descriptions.Item>
              <Descriptions.Item label="Lapses">
                { card["lapses"] }
              </Descriptions.Item>
              <Descriptions.Item label="Reviews">
                { card["reviews"] }
              </Descriptions.Item>
              <Descriptions.Item label="Total reviews">
                { card["total_reviews"] }
              </Descriptions.Item>
              <Descriptions.Item label="Last reviewed">
                { card["last_reviewed"] }
              </Descriptions.Item>
              <Descriptions.Item label="Introduced on">
                { extractDate(card["introduced_on"]) }
              </Descriptions.Item>
              <Descriptions.Item label="Review date">
                { card["review_date"] }
              </Descriptions.Item>
              <Descriptions.Item label="Grade">
                { card["grade"] }
              </Descriptions.Item>
              <Descriptions.Item label="Easiness">
                { card["easiness_factor"].toFixed(2) }
              </Descriptions.Item>
            </Descriptions>
        :
        <Descriptions data-testid="empty-card">
          <Descriptions.Item label="Card data">
            empty
          </Descriptions.Item>
        </Descriptions>
    );
}
