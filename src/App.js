import React from "react";
import { Layout } from "antd";
import AppHeader from "./components/Header";
import Sidebar from "./components/Sidebar";
import OrgChartV1 from "./components/OrgChartV1";
import RightPanel from "./components/RightPanel";
import AppFooter from "./components/Footer";
import { DataProvider } from "./components/dataProcess/dataContext";
import Timeline from "./components/Timeline";

const App = () => {
  const data_global = [
    { title: "Data Item 1", description: "Description for item 1" },
    { title: "Data Item 2", description: "Description for item 2" },
    { title: "Data Item 3", description: "Description for item 3" },
  ];

  return (
    <DataProvider>
      <Layout style={{ minHeight: "100vh" }}>
        <AppHeader />
        <Layout style={{ padding: "20px" }}>
          <Sidebar />
          {/* Container for OrgChart and Timeline with controlled width */}
          <div style={{ flexGrow: 1, marginRight: "20px" }}>
            {/* Wrapper for OrgChartV1 with fixed width */}
            <div style={{ width: "600px", margin: "auto" }}>
              <OrgChartV1 />
            </div>

            {/* Timeline underneath, spanning full width */}
            <div style={{ marginTop: "10px" }}>
              <Timeline />
            </div>
          </div>
          <RightPanel />
        </Layout>
        <AppFooter />
      </Layout>
    </DataProvider>
  );
};

export default App;
