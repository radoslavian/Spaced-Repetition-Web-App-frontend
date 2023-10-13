import {  useEffect, useState } from "react";
import { EFactorDistributionChart } from "./DistributionCharts";
import { useApi } from "../contexts/ApiProvider";
import { useUser } from "../contexts/UserProvider";
import { Spin } from "antd";

export default function EFactorDistributionPage() {
    const api = useApi();
    const { user } = useUser();
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    // compare this and above portion with GradesDistributionPage
    // shouldn't it all go into it' own hook?
    // the differences are in: the url and initial
    // data passed into useState hook.
    useEffect(() => {
        (async () => {
            setLoadingData(true);
            if (!Boolean(user)) return;
            const url = `/users/${user.id}/cards/distribution/e-factor/`;
            const response = await api.get(url);
            if(Boolean(response)) setData(response);
            setLoadingData(false);
        })();
    }, [user, api]);

    return (
        <Spin spinning={loadingData}
              delay={500}>
          <EFactorDistributionChart chartData={data}/>
        </Spin>
    );
}
