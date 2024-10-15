import React, { useContext, useEffect, useState } from 'react';
import { Input, Button, Form } from 'antd';
import { DataContext } from './dataProcess/dataContext'; // Import the context

const EditContent = ({ onCancel }) => {
  const { data_global, updateDataGlobal, set_node_displayed, node_displayed } = useContext(DataContext); // Access data from context
  const [form] = Form.useForm(); // Use Ant Design form to manage inputs
  const [formData, setFormData] = useState({}); // Initialize state to hold form data

  // Load the JSON data into the form on component mount
  useEffect(() => {
    if (node_displayed && node_displayed) {
      setFormData(node_displayed);
      form.setFieldsValue(node_displayed); // Populate the form with initial values
    }
  }, [node_displayed, form]);

  // Handle form field changes and update the form data
  const handleChange = (changedValues) => {
    setFormData({ ...formData, ...changedValues });
  };

  // Confirm the changes by passing the updated form data back to the context
  const handleConfirm = () => {
   
    
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Goal</h2>
      <Form
        form={form}
        initialValues={formData}
        onValuesChange={(_, allValues) => handleChange(allValues)} // Update the form data on changes
        layout="vertical"
      >
        {/* Fields for each property */}
        <Form.Item label="Title" name="Title" style={styles.formItem}>
          <Input placeholder="Enter the goal title" />
        </Form.Item>

        <Form.Item label="Summary" name="Summary" style={styles.formItem}>
          <Input.TextArea rows={3} placeholder="Enter a brief summary" />
        </Form.Item>

        <Form.Item label="Note" name="Note" style={styles.formItem}>
          <Input.TextArea rows={7} placeholder="Enter additional notes" />
        </Form.Item>

        <Form.Item label="Content" name="Content" style={styles.formItem}>
          <Input.TextArea rows={7} placeholder="Enter the content" />
        </Form.Item>

        <Form.Item label="Definition" name="Definition" style={styles.formItem}>
          <Input.TextArea rows={3} placeholder="Enter the definition" />
        </Form.Item>

        <Form.Item label="Priority" name="Priority" style={styles.formItem}>
          <Input placeholder="Enter the priority level" />
        </Form.Item>

        <Form.Item label="Current Status" name="Current_status" style={styles.formItem}>
          <Input.TextArea rows={3} placeholder="Enter the current status" />
        </Form.Item>

        <Form.Item label="Deadline" name="Deadline" style={styles.formItem}>
          <Input placeholder="Enter the deadline" />
        </Form.Item>

        {/* Disabled fields for empty properties */}
        <Form.Item label="Difficulty Rating" name="difficulty_rating" style={styles.formItem}>
          <Input.TextArea rows={1} placeholder="Currently empty" disabled />
        </Form.Item>

        <Form.Item label="Relationship to Others" name="relationship_to_others" style={styles.formItem}>
          <Input.TextArea rows={1} placeholder="Currently empty" disabled />
        </Form.Item>

        {/* Buttons for cancel and confirm */}
        <div style={styles.buttonGroup}>
          <Button onClick={onCancel} style={styles.cancelButton}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleConfirm} style={styles.confirmButton}>
            Confirm
          </Button>
        </div>
      </Form>
    </div>
  );
};

// Inline styles for improved layout and spacing, with wider layout
const styles = {
  container: {
    maxWidth: '1200px', // Increased width
    margin: '0 auto',
    padding: '30px', // Added padding for a more spacious layout
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  formItem: {
    marginBottom: '16px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  cancelButton: {
    marginRight: '10px',
    backgroundColor: '#f44336',
    color: 'white',
  },
  confirmButton: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
};

export default EditContent;
