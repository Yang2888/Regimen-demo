import React from 'react';
import { Layout, Button, Menu, List, Card } from 'antd'; // Ant Design components
const { Header, Sider, Content, Footer } = Layout;

const Sidebar = () => (
  <Card style={{ marginRight: '20px', marginBottom: '20px' }}>
    <Sider style={{ backgroundColor: '#FFFFFF', padding: '20px' }}>
      <Button type="primary" style={{ marginBottom: '20px', padding: '25px', width: '100%' }}>
        Button 1
      </Button>
      <Button type="primary" style={{ marginBottom: '20px', padding: '25px', width: '100%' }}>
        Button 2
      </Button>
      <Button type="primary" style={{ marginBottom: '20px', padding: '25px', width: '100%' }}>
        Button 3
      </Button>
    </Sider>
  </Card>
);

export default Sidebar;
