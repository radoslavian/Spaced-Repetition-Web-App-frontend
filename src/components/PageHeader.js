import {Row, Col, theme, Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

export default function PageHeader() {
    return (
        <Header
          theme="light"
          Style={{
              display: "Flex",
              alignItems: "center",
          }}>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Link to="/">Learn cards</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="statistics">Statistics</Link>
            </Menu.Item>
          </Menu>
        </Header>
    );
}
