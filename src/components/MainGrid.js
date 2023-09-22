import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Result, Button } from "antd";
import LearnCardsPage from "./LearnCardsPage";
import PageHeader from "./PageHeader";
import StatisticsPage from "./StatisticsPage";
import GradesDistributionPage from "./GradesDistributionPage";
import CardsDistributionPage from "./CardsDistributionPage";
import EFactorDistributionPage from "./EFactorDistributionPage";

export default function MainGrid() {
    const navigate = useNavigate();

    return (
        <>
          <PageHeader/>
          <Routes>
            <Route path="/" element={<LearnCardsPage/>}/>
            <Route path="statistics" element={<StatisticsPage/>}>
              <Route path="grades-distribution"
                     element={<GradesDistributionPage/>}
              />
              <Route path="e-factor-distribution"
                     element={<EFactorDistributionPage/>}
              />
              <Route path="memorization"
                     element={<CardsDistributionPage
                                title="Weekly memorization distribution"
                                daysRange={7}
                                path="distribution/memorized/"/>}
              />
              <Route path="cards-distribution"
                     element={<CardsDistributionPage
                                title="Weekly distribution of card reviews"
                                daysRange={7}/>}/>
            </Route>
            <Route path="*" element={
                  <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Button type="primary"
                                   onClick={() => navigate("/")}>
                             Back Home
                           </Button>}
                  />}
              />
          </Routes>
        </>        
    );
}
