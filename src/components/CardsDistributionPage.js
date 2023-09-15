import {  useEffect, useState } from "react";
import { CardDistributionChart } from "./DistributionCharts";
import { useApi } from "../contexts/ApiProvider";
import { useUser } from "../contexts/UserProvider";

export default function CardsDistributionPage(
    {title = "Distribution of card reviews",
     path = "distribution/",
     daysRange = 7}) {
    const api = useApi();
    const { user } = useUser();
    const [data, setData] = useState({});

    useEffect(() => {
        (async () => {
            if (!Boolean(user)) return;
            const url = `/users/${user.id}/cards/${path}`
                  + `?days-range=${daysRange}`;
            const response = await api.get(url);
            if(Boolean(response)) setData(response);
        })();
    }, [user, api, daysRange, path]);

    return (<CardDistributionChart chartData={data}
                                   title={title}/>);
}

