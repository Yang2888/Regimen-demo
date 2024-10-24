import { Graph } from "react-d3-graph";

import React from 'react';
import { Card } from 'antd';
import { Layout } from 'antd'; // Ant Design components
import OrgChartTree from './ChartGoals'; // Adjust the path if necessary
import { DataContext } from './dataProcess/dataContext';
import { useContext } from 'react';

// graph payload (with minimalist structure)
const data = {
  nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
  links: [
    { source: "Harry", target: "Sally" },
    { source: "Harry", target: "Alice" },
  ],
};

// the graph configuration, just override the ones you need
const myConfig = {
  nodeHighlightBehavior: true,
  node: {
    color: "lightgreen",
    size: 120,
    highlightStrokeColor: "blue",
  },
  link: {
    highlightColor: "lightblue",
  },
};

const onClickNode = function(nodeId) {
  window.alert(`Clicked node ${nodeId}`);
};

const onClickLink = function(source, target) {
  window.alert(`Clicked link between ${source} and ${target}`);
};




const OrgGraphV2 = () => {
    const { data_global, updateDataGlobal, node_displayed, refresh_key } = useContext(DataContext); 
    // console.log(node_displayed)
    return (
    // <Content style={{ padding: '0 0px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '70%' }}>
      <Card bodyStyle={{ padding: '0' }} style={{ width: '100%', height: '100%', marginBottom: '20px' }}>
        <Graph
  id="graph-id" // id is mandatory
  data={data}
  config={myConfig}
  onClickNode={onClickNode}
  onClickLink={onClickLink}
/>;
      </Card>
    // </Content>
  )};
  
  export default OrgGraphV2;