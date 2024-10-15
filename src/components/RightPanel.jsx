import React, { useContext } from 'react';
import { List, Card, Layout } from 'antd';
import { DataContext } from './dataProcess/dataContext'; // Import DataContext

const { Sider } = Layout;

const RightPanel = () => {
  const { data_global } = useContext(DataContext); // Access data from context

  return (
    <Card style={{ width: 900,  marginLeft: '20px', marginBottom: '20px' }}>
      
      <Sider style={{ backgroundColor: '#FFFFFF', padding: '10px' }}>
        <h3>Data Information</h3>
        <h1>{ JSON.stringify(data_global)}</h1>
      </Sider>
    </Card>
  );
};

export default RightPanel;
