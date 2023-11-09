import { Card } from "antd";
import CardsMenu from "./CardsMenu";

export default function MainDisplay({testId, title, children}) {
    const mainTitle = (
        <>
          <CardsMenu/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span>{ title }</span>
        </>
    );
    return (
        <Card title={mainTitle}
              size="large"
              data-testid={testId}
              type="inner"
              id="main-study-display">
          { children }
        </Card>
    );
}
