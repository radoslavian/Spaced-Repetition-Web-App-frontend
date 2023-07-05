import { Descriptions } from 'antd';
const Item = Descriptions;

export default function LearningProgress(
    {scheduled = 0, cramQueue=0, queued=0}) {
    return(
        <Descriptions data-testid="learning-progress-indicator"
                      size="small">
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
