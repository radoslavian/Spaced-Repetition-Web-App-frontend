import { Layout, List, Typography, Space } from "antd";
import { GithubFilled, LinkedinFilled } from "@ant-design/icons";

const { Title } = Typography;
const { Footer } = Layout;

function renderItem(listItem){
    return (
        <List.Item>{ listItem }</List.Item>
    );
};

function ListTitle({children}) {
    return (
        <Title level={5}>
          { children }
        </Title>
    );
}

function Anchor({children, href}) {
    return (
        <a rel="noreferrer"
           target="_blank"
           href={href}>
          { children }
        </a>
    );
}

const personalLinks = [
    (
        <span>
          <GithubFilled />
          &nbsp;
          <Anchor href="https://github.com/radoslavian">
            My GitHub
          </Anchor>
        </span>
    ),
    (
        <span>
          <LinkedinFilled />
          &nbsp;
          <Anchor href="https://www.linkedin.com/in/radoslaw-kuzyk-a10191129/">
            My LinkedIn
          </Anchor>
        </span>
    ),
];

const technologiesUsed = [
    (
        <Anchor href="https://www.djangoproject.com/">
          Django
        </Anchor>
    ),
    (
        <Anchor href="https://react.dev/">
          React
        </Anchor>
    ),
    (
        <Anchor href="https://ant.design/">
          Ant Design
        </Anchor>
    ),
    (
        <Anchor href="https://www.chartjs.org/">
          Chart.js
        </Anchor>
    )
];

const externalLinks = [
    (
        <Anchor href="https://super-memory.com/english/ol/sm2.htm">
          The SuperMemo&nbsp;2 algorithm
        </Anchor>
    ),
    (
        <Anchor href="https://en.wikipedia.org/wiki/SuperMemo">
          Supermemo software (Wikipedia)
        </Anchor>
    ),
    (
        <Anchor href="https://en.wikipedia.org/wiki/Spaced_repetition">
          Spaced repetition learning technique (Wikipedia)
        </Anchor>
    ),
    (
        <Anchor href="https://www.wired.com/2008/04/ff-wozniak/">
          Want to Remember Everything You'll Ever Learn?<br/>Surrender
          to This Algorithm (Wired, 2008)
        </Anchor>
    )
];

export default function PageFooter() {
    
    return (
        <Footer style={{
            background: "white",
        }}>
          <Space align="baseline"
                 size="large"
                 wrap={true}>
            <List header={<ListTitle>My social links</ListTitle>}
                  dataSource={personalLinks}
                  renderItem={renderItem}/>
            <List header={<ListTitle>Technologies used</ListTitle>}
                  dataSource={technologiesUsed}
                  renderItem={renderItem}/>
            <List header={<ListTitle>External links</ListTitle>}
                  dataSource={externalLinks}
                  renderItem={renderItem}/>
          </Space>
        </Footer>
    );
}
