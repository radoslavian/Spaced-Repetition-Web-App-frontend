import { Menu } from "antd";
import { useUser } from "../contexts/UserProvider.js";
import { useNavigate } from "react-router-dom";
import { AreaChartOutlined, UserOutlined,
         BookOutlined } from "@ant-design/icons";

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
            label: "Statistics",
            key: "/statistics/cards-distribution"
        },
        {
            icon: <UserOutlined/>,
            label: user?.username,
            key: "userMenu",
            style: {marginLeft: "auto"},
            children: [
                {
                    label: "Log out",
                    key: "logout",
                    onClick: logOut
                }
            ]
        }
    ];

    const navigateKey = ({ key }) => {
        if (["userMenu", "logout"].indexOf(key) !== -1) {
            return;
        }
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
