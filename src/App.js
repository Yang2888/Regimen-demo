import React, { createContext, useContext } from 'react';
import { Layout, Button, Menu, List } from 'antd'; // Ant Design components
import OrgChartTree from './components/OrgChartTree'; // Adjust the path as necessary

const { Header, Sider, Content } = Layout;

const App = () =>  {
  // Example data for the right-hand side list
  const dataList = [
    { title: 'Data Item 1', description: 'Description for item 1' },
    { title: 'Data Item 2', description: 'Description for item 2' },
    { title: 'Data Item 3', description: 'Description for item 3' },
  ];

  return (
    
    <Layout>
      {/* Header with navigation */}
      <Header style={{ backgroundColor: '#001529', padding: 0 }}>
        <Menu mode="horizontal" theme="dark">
          <Menu.Item key="1">Home</Menu.Item>
          <Menu.Item key="2">About</Menu.Item>
          <Menu.Item key="3">Contact</Menu.Item>
        </Menu>
      </Header>

      <Layout>
        <Sider style={{ backgroundColor: '#f0f2f5', padding: '10px' }} width={200}>
          <Button type="primary" style={{ marginBottom: '10px', width: '100%' }}>
            Button 1
          </Button>
          <Button type="primary" style={{ marginBottom: '10px', width: '100%' }}>
            Button 2
          </Button>
          <Button type="primary" style={{ marginBottom: '10px', width: '100%' }}>
            Button 3
          </Button>
        </Sider>

        <Content style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <OrgChartTree width="1000px" height="800px" />
        </Content>

        <Sider style={{ backgroundColor: '#f0f2f5', padding: '10px' }} width={300}>
          <h3>Data Information</h3>
          <List
            itemLayout="horizontal"
            dataSource={dataList}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Sider>
      </Layout>
    </Layout>
  );
}

export default App;
