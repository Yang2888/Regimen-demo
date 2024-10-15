import React, { useContext } from 'react';
import { Layout, Button, Card } from 'antd'; // Ant Design components
import { DataContext } from './dataProcess/dataContext'; // Access data context

const { Sider } = Layout;

const Sidebar = () => {
  const { updateDataGlobal } = useContext(DataContext); // Access data from context

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
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file); // Read the file as text
    } else {
      console.error("Please upload a valid JSON file");
    }
  };

  // Trigger file input dialog when Button 1 is clicked
  const handleButtonClick = () => {
    document.getElementById('fileInput').click(); // Programmatically click the file input
  };

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
          Upload JSON
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
};

export default Sidebar;
