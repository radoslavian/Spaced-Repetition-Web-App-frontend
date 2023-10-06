import { Button, Popover, Badge } from "antd";

const defaultContent = {
    title: "default title",
    content: "default content"
};

export default function LearnButton(
    {dataTestId, popoverContent = defaultContent, count = 0,
     onClick = () => {}, buttonTitle = "", buttonType = "default",
     badgeColor="cyan"}) {
    return (
        <div data-testid={`button-${dataTestId}`}>
        <Popover placement="rightTop"
                 title={popoverContent.title}
                 content={popoverContent.content}>
          <Badge count={count}
                 color={badgeColor}
                 overflowCount={999}>
            <Button type={buttonType}
                    size="large"
                    data-testid={dataTestId}
                    onClick={onClick}>
              { buttonTitle }
            </Button>
          </Badge>
        </Popover>
        </div>
    );
}
