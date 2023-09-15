import {  useEffect, useState } from "react";
import { CardDistributionChart } from "./DistributionCharts";
import { useApi } from "../contexts/ApiProvider";
import { useUser } from "../contexts/UserProvider";

export function CardsDistributionPage(
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

export function DailyCardsDistributionPage() {
    return (<CardsDistributionPage
              title="Weekly distribution of card reviews"
              daysRange={7}/>);
}

export function MemorizedCardsDistributionPage() {
    return (<CardsDistributionPage
                    title="Weekly memorization distribution"
                    daysRange={7}
                    path="distribution/memorized/"/>);
}
