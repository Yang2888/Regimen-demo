import React from 'react';
import { Menu, Layout } from 'antd';

const { Header } = Layout;

const AppHeader = () => (
  <Header style={{ backgroundColor: '#001529', padding: 0, marginBottom: '20px' }}>
    <Menu mode="horizontal" theme="dark" style={{ lineHeight: '64px' }}>
      <Menu.Item key="1" style={{ width: '150px', textAlign: 'center' }}>Home</Menu.Item>
      {/* Add more menu items if needed */}
    </Menu>
  </Header>
);

export default AppHeader;
