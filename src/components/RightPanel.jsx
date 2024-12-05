import React, { useContext, useEffect, useState } from 'react';
import { List, Card, Layout, Button, Divider } from 'antd';
import { DataContext } from './dataProcess/dataContext'; // Import DataContext
import DisplayContent from './DisplayModeCard';
import GenerateContent from './GenerateModeCard';
import EditContent from './EditModeCard';

const { Sider } = Layout;

const RightPanel = () => {
  const { data_global, rightPanelShowing, set_rightPanelShowing } = useContext(DataContext); // Access data from context
  const [activeContent, setActiveContent] = useState('Display'); // State to manage the content

  // Function to render content based on the selected button
  const renderContent = () => {
    switch (activeContent) {
      case 'Display':
        return <DisplayContent />;
      case 'Edit':
        return <EditContent />;
      case 'Generate':
        return <GenerateContent />;
      default:
        return <div>Select an option to display content</div>;
    }
  };

  useEffect(()=>{
    setActiveContent(rightPanelShowing)
    // console.log(rightPanelShowing)
  }, [rightPanelShowing])

  return (
    <Card style={{ width: 820, marginLeft: '20px', marginBottom: '20px' }}>
      {/* Buttons for Display, Edit, Generate */}
      <div style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={() => set_rightPanelShowing('Display')} style={{ marginRight: '10px' }}>
          Display
        </Button>
        <Button type="primary" onClick={() => set_rightPanelShowing('Edit')} style={{ marginRight: '10px' }}>
          Edit
        </Button>
        <Button type="primary" onClick={() => set_rightPanelShowing('Generate')}>
          Generate
        </Button>
      </div>

      {/* Divider to separate buttons and content */}
      <Divider style={{ borderWidth: '1px', borderColor: '#000' }} />
      {renderContent()}
      {/* <Sider style={{ backgroundColor: '#FFFFFF', padding: '0px' }}>
        {renderContent()}
      </Sider> */}
    </Card>
  );
};

export default RightPanel;
