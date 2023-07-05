import { Card, Space } from "antd";

export default function MainDisplay({testId, title, children}) {
    return (
        <Card title={title}
              size="large"
              data-testid={testId}
              type="inner">
            { children }
        </Card>
    );
}
