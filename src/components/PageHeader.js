import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { AreaChartOutlined, UserOutlined,
         BookOutlined } from "@ant-design/icons";
import { useUser } from "../contexts/UserProvider.js";

const notSelectables = ["userMenu", "logout", "cardMenu"];
const { Header } = Layout;

export default function PageHeader() {
    const navigate = useNavigate();
    const currentLocation = window.location.pathname;
    const {user, logOut } = useUser();

    const menuItems = [
        {
            icon: <BookOutlined />,
            label: "Study",
            key: "/"
        },
        {
            icon: <AreaChartOutlined />,
            label: "Charts",
            key: "/statistics/cards-distribution"
        },
        {
            icon: <UserOutlined/>,
            label: user?.username,
            key: "userMenu",
            style: {marginLeft: "auto"},
            children: [
                {
                    label: "User details & statistics",
                    key: "user-details",
                },
                {
                    label: "Log out",
                    key: "logout",
                    onClick: logOut
                }
            ]
        }
    ];

    const navigateKey = ({ key }) => {
        if (notSelectables.indexOf(key) !== -1) {
            return;
        }
        console.log(key);
        navigate(key);
    };

    return (
        <Menu
          theme="light"
          mode="horizontal"
          items={menuItems}
          defaultSelectedKeys={[currentLocation]}
          onClick={navigateKey}
        />
    );
}
