import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Result, Button, Typography } from "antd";
import LearnCardsPage from "./LearnCardsPage";
import PageHeader from "./PageHeader";
import StatisticsPage from "./StatisticsPage";
import GradesDistributionPage from "./GradesDistributionPage";
import CardsDistributionPage from "./CardsDistributionPage";
import EFactorDistributionPage from "./EFactorDistributionPage";

const { Text } = Typography;

const MemorizationDistribution = () => (
    <>
      <CardsDistributionPage
        path="distribution/memorized/"
        title="Cards memorized in past weeks"/>
      <div style={{margin: "30px",
                   textAlign: "center"}}>
        <Text type="secondary">
          Please keep in mind that the chart
          only shows cards that have been added to the
          learning process and are still in it.
          Forgetting a card will remove
          it from the chart.
        </Text>
      </div>
    </>
);

export default function MainGrid() {
    const navigate = useNavigate();
    
    return (
        <>
          <PageHeader/>
          <Routes>
            <Route path="/" element={<LearnCardsPage/>}/>
            <Route path="statistics" element={<StatisticsPage/>}>
              <Route path="grades-distribution"
                     key="grades-distribution-route"
                     element={<GradesDistributionPage/>}
              />
              <Route path="e-factor-distribution"
                     keys="e-factor-distribution-route"
                     element={<EFactorDistributionPage/>}
              />
              <Route exact
                     path="memorization"
                     element={<MemorizationDistribution/>}
              />
              <Route path="cards-distribution"
                     key="cards-distribution-route"
                     element={
                         <CardsDistributionPage
                           title="Distribution of card reviews"/>
                     } />
                
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
