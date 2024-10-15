import React from 'react';
import { Layout, Button, Menu, List, Card } from 'antd'; // Ant Design components
import OrgChartTree from './components/OrgChartTree'; // Adjust the path as necessary

const { Header, Sider, Content, Footer } = Layout;

const App = () => {
  // Example data for the right-hand side list
  const dataList = [
    { title: 'Data Item 1', description: 'Description for item 1' },
    { title: 'Data Item 2', description: 'Description for item 2' },
    { title: 'Data Item 3', description: 'Description for item 3' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header with navigation */}
      <Header style={{ backgroundColor: '#001529', padding: 0, marginBottom: '20px' }}>
        <Menu mode="horizontal" theme="dark" style={{ lineHeight: '64px' }}>
          <Menu.Item key="1" style={{ width: '150px', textAlign: 'center' }}>Home</Menu.Item>
          {/* <Menu.Item key="2" style={{ width: '150px', textAlign: 'center' }}>About</Menu.Item> */}
          {/* <Menu.Item key="3" style={{ width: '150px', textAlign: 'center' }}>Contact</Menu.Item> */}
        </Menu>
      </Header>

      <Layout style={{ padding: '20px',  }}>
        {/* Sidebar wrapped in a card */}
        {/* <Card style={{ width: 300, marginRight: '20px', marginBottom: '20px' }}> */}
        <Card style={{  marginRight: '20px', marginBottom: '20px' }}>
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

        {/* Content area with reduced width to give space to the right panel */}
        <Content style={{ padding: '0 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '70%',  }}>
          <Card bodyStyle={{ padding: '0',  }} style={{ width: '100%', marginBottom: '20px',  }}>
            <OrgChartTree width="1800px" height="750px" />
          </Card>
        </Content>

        {/* Right-side panel wrapped in a card */}
        <Card style={{ width: 600, marginLeft: '20px', marginBottom: '20px' }}>
          <Sider style={{ backgroundColor: '#FFFFFF', padding: '10px' }}>
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
        </Card>
      </Layout>

      {/* Footer */}
      <Footer style={{ textAlign: 'center', marginTop: '20px', backgroundColor: '#000000' }}>
        ©2024 Your Company Name. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default App;
