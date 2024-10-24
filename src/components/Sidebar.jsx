import React, { useContext, useState } from 'react';
import { Layout, Button, Card, Modal } from 'antd'; // Ant Design components
import { DataContext } from './dataProcess/dataContext'; // Access data context
import { saveAs } from 'file-saver'; // Import FileSaver for saving files

import InitialData from './dataProcess/initData';

const { Sider } = Layout;

const Sidebar = () => {
  const { data_global, updateDataGlobal, set_node_displayed, node_displayed, set_refresh_key, refresh_key } = useContext(DataContext); // Access data from context

  // Function to handle file upload and read the JSON file
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (file && file.type === "application/json") { // Check if the file is a JSON file
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result; // Read the content of the file
        try {
          const jsonData = JSON.parse(fileContent); // Parse the JSON content
          updateDataGlobal(jsonData); // Update the context with the parsed data
          set_node_displayed(jsonData); // Update the context with the parsed data
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file); // Read the file as text
    } else {
      console.error("Please upload a valid JSON file");
    }
    handleResetPos()
    event.target.value = null
  };

  // Function to save the JSON data to a user-selected folder
  const handleSaveClick = () => {
    if (data_global) {
      const blob = new Blob([JSON.stringify(data_global, null, 2)], { type: "application/json" });
      saveAs(blob, "data.json"); // Prompt user to save the file with a default name "data.json"
    } else {
      console.error("No data available to save.");
    }
  };

  // Trigger file input dialog when Button 1 is clicked
  const handleButtonClick = () => {
    document.getElementById('fileInput').click(); // Programmatically click the file input
  };

  const handleCreateClick = () => {
    updateDataGlobal(InitialData)
    set_node_displayed(InitialData)
  }

  const handleResetPos = () => {
    set_refresh_key(!refresh_key)
    // console.log(refresh_key)
  }

  const handleDebug = () => {
    console.clear();

    console.log(node_displayed)
    
  }

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to show the modal when button is clicked
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle "OK" button click in the modal
  const handleOk = () => {
    setIsModalVisible(false);
  };

  // Function to handle "Cancel" button click in the modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Content for the modal
  const modalContent = "This website is a demo website for regimen visualization. The left panel are buttons like getting user input/saving regimen; the middle panel is the regimen visualization; the right panel is the details of the regimen, and user can ask questitons about the regimen.\n For the visualization, click i to show the detail of this certain node, click + and - to see/hide subnodes.";


  return (
    <Card style={{ marginRight: '20px', marginBottom: '20px' }}>
      <Sider style={{ backgroundColor: '#FFFFFF', padding: '20px' }}>
        <input
          id="fileInput"
          type="file"
          style={{ display: 'none' }} // Hide the file input element
          accept=".json"
          onChange={handleFileUpload} // Handle file selection
        />
        <Button
          onClick={handleButtonClick} // Trigger file upload on button click
          type="primary"
          style={{ marginBottom: '20px', padding: '25px', width: '100%' }}
        >
          Read Data
        </Button>
        <Button
          onClick={handleSaveClick} // Trigger file save on button click
          type="primary"
          style={{ marginBottom: '20px', padding: '25px', width: '100%' }}
        >
          Save Data
        </Button>
        {/* <Button 
          onClick={handleCreateClick} // Trigger file save on button click
        
        type="primary" style={{ marginBottom: '20px', padding: '25px', width: '100%' }}>
          Create Data
        </Button> */}

        <Button 
          onClick={handleResetPos} // Trigger file save on button click
        
        type="primary" style={{ marginBottom: '20px', padding: '25px', width: '100%' }}>
          Reset Position
        </Button>

        {/* <Button 
          onClick={handleDebug} // Trigger file save on button click
        
        type="primary" style={{ marginBottom: '20px', padding: '25px', width: '100%' }}>
          Debug
        </Button> */}

        <Button 
        onClick={showModal} // Trigger modal on button click
        type="primary" 
        style={{ 
          backgroundColor: 'green', 
          borderColor: 'green', 
          marginBottom: '20px', 
          padding: '25px', 
          width: '100%' 
        }}>
        Readme
      </Button>

      {/* Modal component with content */}
      <Modal 
        title="About This Website" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
      >
        <p>{modalContent}</p>
      </Modal>


      </Sider>
    </Card>
  );
};

export default Sidebar;
