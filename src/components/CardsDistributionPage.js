import {  useEffect, useState } from "react";
import { CardDistributionChart } from "./DistributionCharts";
import { useApi } from "../contexts/ApiProvider";
import { useUser } from "../contexts/UserProvider";
import { Segmented, Spin } from "antd";

export default function CardsDistributionPage(
    { title = "Distribution of card reviews",
      path = "distribution/" }) {
    const api = useApi();
    const { user } = useUser();
    const [data, setData] = useState({});
    const [daysRange, setDaysRange] = useState(7);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        (async () => {
            if (!Boolean(user)) return;
            setLoadingData(true);
            const url = `/users/${user.id}/cards/${path}`
                  + `?days-range=${daysRange}`;
            const response = await api.get(url);
            if(Boolean(response)) setData(response);
            setLoadingData(false);
        })();
    }, [user, api, daysRange, path]);

    const handleOnChange = value => {
        switch(value) {
        case "one-week":
            setDaysRange(7);
            break;
        case "two-weeks":
            setDaysRange(14);
            break;
        case "one-month":
            setDaysRange(31);
            break;
        default:
            console.log(value);
            break;
        }
    };

    return (
        <Spin spinning={loadingData}
              delay={400}>
          <Segmented data-testid="days-range-selector"
                     defaultValue="one-week"
                     block
                     size="large"
                     onChange={handleOnChange}
                     options={[
                         {
                             label: "one week",
                             value: "one-week"
                         },
                         {
                             label: "two weeks",
                             value: "two-weeks"
                         },
                         {
                             label: "one month",
                             value: "one-month"
                         }
                     ]}
          />
          <CardDistributionChart chartData={data}
                                 title={title}/>
        </Spin>
    );
}

