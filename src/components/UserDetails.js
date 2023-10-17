import { Descriptions, Skeleton } from "antd";

export default function UserDetails({ user }) {
    const userLoaded = user !== undefined && user !== null;

    return (
        userLoaded ? (
            <Descriptions data-testid="user-details"
                          title="User details"
                          layout="horizontal"
                          column={1}
                             size="middle"
                             bordered>
                 <Descriptions.Item label="User Id">
                   { user.id }
                 </Descriptions.Item>
                 <Descriptions.Item label="User email">
                   { user.email }
                 </Descriptions.Item>
                 <Descriptions.Item label="User name">
                   { user.username }
                 </Descriptions.Item>
            </Descriptions>
        ) : <Skeleton/>
    );
}
