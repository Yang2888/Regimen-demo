import React from 'react';
import { Layout, Button, Menu, List, Card } from 'antd'; // Ant Design components
import { DataContext } from './dataProcess/dataContext';
import { useContext } from 'react';

const { Header, Sider, Content, Footer } = Layout;


const Sidebar = () => {
  const { data_global, updateDataGlobal  } = useContext(DataContext); // Access data from context

  const exampleDict = {
    key1: "new value for key1",
    key2: "new value for key2",
    key3: "new value for key3"
  };

  return (
  <Card style={{ marginRight: '20px', marginBottom: '20px' }}>
    <Sider style={{ backgroundColor: '#FFFFFF', padding: '20px' }}>
      <Button
      onClick={(e)=>{
        updateDataGlobal(exampleDict)
      }}
      type="primary" style={{ marginBottom: '20px', padding: '25px', width: '100%' }}>
        Read Data
      </Button>
      <Button type="primary" style={{ marginBottom: '20px', padding: '25px', width: '100%' }}>
        Button 2
      </Button>
      <Button type="primary" style={{ marginBottom: '20px', padding: '25px', width: '100%' }}>
        Button 3
      </Button>
    </Sider>
  </Card>
)};

export default Sidebar;
