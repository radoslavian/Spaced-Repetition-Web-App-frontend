import {Row, Col, theme, Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

export default function PageHeader() {
    const navigate = useNavigate();
    const currentLocation = window.location.pathname;

    const menuItems = [
        {
            label: "Learning",
            key: "/"
        },
        {
            label: "Statistics",
            key: "/statistics/cards-distribution"
        }
    ];

    return (
        <Menu
          theme="light"
          mode="horizontal"
          items={menuItems}
          defaultSelectedKeys={[currentLocation]}
          onClick={({ key }) => navigate(key)}
        />
    );
}
