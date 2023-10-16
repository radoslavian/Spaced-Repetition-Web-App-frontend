import {  useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import { Descriptions, Skeleton } from "antd";
import Suspense from "./Suspense";
import GeneralStatistics from "./GeneralStatistics";
import { useApi } from "../contexts/ApiProvider";

export default function UserPage() {
    const { user } = useUser();
    const api = useApi();
    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        (async () => {
            if (user?.id !== undefined) {
                const url = `/users/${user.id}/cards/general-statistics/`;
                const response = await api.get(url);
                if (response?.status === undefined) {
                    setStatistics(response);
                }
            }
        })();
    }, [api, user]);

    return (
        <>
          <Suspense displayChildren={Boolean(user)}
                    fallback={<Skeleton/>}>
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
          </Suspense>
          <GeneralStatistics statistics={statistics}/>
        </>
    );
}
