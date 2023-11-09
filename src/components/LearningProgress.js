import { Descriptions } from 'antd';
const Item = Descriptions;

export default function LearningProgress(
    {scheduled = 0, cramQueue=0, queued=0}) {
    return(
        <Descriptions data-testid="learning-progress-indicator"
                      size="small"
                      column={{
                          xs: 3,
                          sm: 3,
                          md: 3,
                          lg: 3,
                          xl: 3,
                          xxl: 3,
                      }}
        >
        <Item label="Scheduled">
          {scheduled}
        </Item>
          <Item label="Cram">
            {cramQueue}
          </Item>
          <Item label="Queued">
            {queued}
          </Item>
        </Descriptions>
    );
}
