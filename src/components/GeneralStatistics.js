import { Descriptions, Skeleton } from "antd";

export default function GeneralStatistics({ statistics }) {
    const displayStatistics = (typeof(statistics) === "object"
                               && Object.keys(statistics).length > 0);

    const FurthestScheduledReviewed = () => (
        <Descriptions data-testid="furthest-scheduled-card-review"
                      title="Card with the furthest review date"
                      layout="vertical"
                      bordered>
          <Descriptions.Item label="Card title">
            { statistics.furthest_scheduled_review.card_title }
          </Descriptions.Item>
          <Descriptions.Item label="Review date">
            { statistics.furthest_scheduled_review.review_date }
          </Descriptions.Item>
        </Descriptions>
    );

    const StatisticsData = () => (
        <>
          <Descriptions title="General statistics"
                        data-testid="general-statistics"
                        layout="horizontal"
                        column={1}
                        size="middle"
                        bordered>
            <Descriptions.Item label="Retention score">
              { statistics.retention_score }%
            </Descriptions.Item>
            <Descriptions.Item label="Total number of cards">
              { statistics.total_cards }
            </Descriptions.Item>
            <Descriptions.Item label="Memorized cards (total)">
              { statistics.number_of_memorized }
            </Descriptions.Item>
            <Descriptions.Item label="Number of queued cards (total)">
              { statistics.total_cards - statistics.number_of_memorized }
            </Descriptions.Item>
          </Descriptions>
          { statistics.furthest_scheduled_review !== null
            &&  <FurthestScheduledReviewed/> }
        </>
    );

    return (
        <>
          {
              displayStatistics ?
                  <StatisticsData/>
                  :
                  <Skeleton/>
          }
        </>
    );
}

