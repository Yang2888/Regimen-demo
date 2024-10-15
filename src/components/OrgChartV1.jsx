import React from 'react';
import { Card } from 'antd';
import { Layout } from 'antd'; // Ant Design components
import OrgChartTree from './OrgChartTree'; // Adjust the path if necessary

const { Header, Sider, Content, Footer } = Layout;


const OrgChartV1 = () => (
  // <Content style={{ padding: '0 0px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '70%' }}>
    <Card bodyStyle={{ padding: '0' }} style={{ width: '100%', height: '100%', marginBottom: '20px' }}>
      <OrgChartTree width="1800px" height="750px" />
    </Card>
  // </Content>
);

export default OrgChartV1;
