import {Row, Col, theme } from "antd";
import { Route, Routes } from "react-router-dom";
import LearnCardsPage from "./LearnCardsPage";
import PageHeader from "./PageHeader";
import { Link } from "react-router-dom";

export default function MainGrid() {

    return (
        <>
          <PageHeader/>
          <Routes>
            <Route path="/" element={<LearnCardsPage/>}/>
            <Route path="statistics" element={
                <h1>
                  There will be statistics here, once.
                </h1>}/>
          </Routes>
        </>        
    );
}
