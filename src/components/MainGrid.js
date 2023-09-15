import { Route, Routes } from "react-router-dom";
import LearnCardsPage from "./LearnCardsPage";
import PageHeader from "./PageHeader";
import StatisticsPage from "./StatisticsPage";
import GradesDistributionPage from "./GradesDistributionPage";
import { MemorizedCardsDistributionPage,
         DailyCardsDistributionPage }from "./CardsDistributionPage";
import EFactorDistributionPage from "./EFactorDistributionPage";

export default function MainGrid() {
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
                     element={<MemorizedCardsDistributionPage/>}
              />
              <Route path="cards-distribution"
                     element={<DailyCardsDistributionPage/>}/>
            </Route>
          </Routes>
        </>        
    );
}
