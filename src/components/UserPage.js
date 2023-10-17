import {  useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import { useApi } from "../contexts/ApiProvider";
import GeneralStatistics from "./GeneralStatistics";
import UserDetails from "./UserDetails";

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
          <UserDetails user={user}/>
          <GeneralStatistics statistics={statistics}/>
        </>
    );
}
