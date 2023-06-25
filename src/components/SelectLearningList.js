import { Card, Space } from "antd";

export default function SelectLearningList({children}) {
    return (
        <Card title="Select collection to learn:"
              size="large"
              type="inner">
          <Space direction="vertical"
                 size="large">
            { children }
          </Space>
        </Card>
    );
}
