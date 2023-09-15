import { Menu, Layout } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { CardDistributionChart,
         GradesDistributionChart,
         EFactorDistribution } from "./DistributionCharts";
import { useState } from "react";

const { Content, Sider } = Layout;

export default function StatisticsPage() {
    const navigate = useNavigate();
    const currentLocation = window.location.pathname;

    const menuItems = [
        {
            label: "Cards distribution",
            key: "/statistics/cards-distribution",
        },
        {
            label: "Cards memorization",
            key: "/statistics/memorization"
        },
        {
            label: "Grades distribution",
            key: "/statistics/grades-distribution"
        },
        {
            label: "E-Factor distribubtion",
            key: "/statistics/e-factor-distribution"
        }
    ];

    return (
        <Layout>
          <Sider breakpoint="xs" theme="light">
            <Menu
              theme="light"
              mode="vertical"
              items={menuItems}
              onClick={({ key }) => navigate(key)}
              defaultSelectedKeys={[currentLocation]}
            />
          </Sider>
          <Content>
            <Outlet/>
          </Content>
        </Layout>
    );
}
