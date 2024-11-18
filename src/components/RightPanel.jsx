import React, { useContext, useState } from 'react';
import { List, Card, Layout, Button, Divider } from 'antd';
import { DataContext } from './dataProcess/dataContext'; // Import DataContext
import DisplayContent from './DisplayModeCard';
import EditContent from './EditModeCard';
import GenerateContent from './GenerateModeCard';

const { Sider } = Layout;

const RightPanel = () => {
  const { data_global } = useContext(DataContext); // Access data from context
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

  return (
    <Card style={{ width: 900, marginLeft: '20px', marginBottom: '20px' }}>
      {/* Buttons for Display, Edit, Generate */}
      <div style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={() => setActiveContent('Display')} style={{ marginRight: '10px' }}>
          Display
        </Button>
        <Button type="primary" onClick={() => setActiveContent('Edit')} style={{ marginRight: '10px' }}>
          Question-Answer
        </Button>
        <Button type="primary" onClick={() => setActiveContent('Generate')}>
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
