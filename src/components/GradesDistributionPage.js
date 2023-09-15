import {  useEffect, useState } from "react";
import { GradesDistributionChart } from "./DistributionCharts";
import { useApi } from "../contexts/ApiProvider";
import { useUser } from "../contexts/UserProvider";

export default function GradesDistributionPage() {
    const api = useApi();
    const { user } = useUser();
    const [data, setData] = useState({});

    // compare this and above portion with CardsDistributionPage
    // shouldn't it all go into it' own hook?
    // the difference is in the url only.
    useEffect(() => {
        (async () => {
            if (!Boolean(user)) return;
            const url = `/users/${user.id}/cards/distribution/grades/`;
            const response = await api.get(url);
            if(Boolean(response)) setData(response);
        })();
    }, [user, api]);

    return <GradesDistributionChart chartData={data}/>;
}
