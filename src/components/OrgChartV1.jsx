import React from 'react';
import { Card } from 'antd';
import { Layout } from 'antd'; // Ant Design components
import OrgChartTree from './ChartGoals'; // Adjust the path if necessary
import { DataContext } from './dataProcess/dataContext';
import { useContext } from 'react';


const { Header, Sider, Content, Footer } = Layout;


const OrgChartV1 = () => {
  const { data_global, updateDataGlobal, node_displayed } = useContext(DataContext); 
  console.log(node_displayed)
  return (
  // <Content style={{ padding: '0 0px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '70%' }}>
    <Card bodyStyle={{ padding: '0' }} style={{ width: '100%', height: '100%', marginBottom: '20px' }}>
      <OrgChartTree width="1800px" height="1200px" treeData={data_global} />
    </Card>
  // </Content>
)};

export default OrgChartV1;
