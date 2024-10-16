import React, { useContext, useEffect, useState } from 'react';
import { Input, Button, Form } from 'antd';
import { DataContext } from './dataProcess/dataContext'; // Import the context

const EditContent = () => {
  const { data_global, updateDataGlobal, set_node_displayed, node_displayed, edit_certain_node } = useContext(DataContext); // Access data from context
  const [formData, setFormData] = useState({}); // Initialize state to hold original form data
  const [formDraft, setFormDraft] = useState({}); // Initialize state to hold draft form data

  // Load the JSON data into the form on component mount
  useEffect(() => {
    if (node_displayed) {
      setFormData(node_displayed); // Store original data in formData
      setFormDraft(node_displayed); // Sync formDraft with node_displayed
    }
  }, [node_displayed]);

  // Handle input change for two-way binding
  const handleInputChange = (field, value) => {
    setFormDraft((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Confirm the changes and pass formDraft back to the context
  const handleConfirm = () => {
    setFormData(formDraft); // Save the draft as the new original data
    edit_certain_node(formDraft); // Update the global context or save the changes
  };

  const onCancel = () => {
    // Reset formDraft to the original formData
    setFormDraft(formData); // Sync formDraft back to formData
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Goal</h2>
      <div style={styles.buttonGroup}>
          <Button onClick={onCancel} style={styles.cancelButton}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleConfirm} style={styles.confirmButton}>
            Confirm
          </Button>
        </div>
      <Form layout="vertical">
        {/* Two-way binding: value is from formDraft, onChange updates formDraft */}
        <Form.Item label="Title" style={styles.formItem}>
          <Input
            value={formDraft.Title || ''}
            onChange={(e) => handleInputChange('Title', e.target.value)}
            placeholder="Enter the goal title"
          />
        </Form.Item>

        <Form.Item label="Summary" style={styles.formItem}>
          <Input.TextArea
            rows={3}
            value={formDraft.Summary || ''}
            onChange={(e) => handleInputChange('Summary', e.target.value)}
            placeholder="Enter a brief summary"
          />
        </Form.Item>

        <Form.Item label="Note" style={styles.formItem}>
          <Input.TextArea
            rows={7}
            value={formDraft.Note || ''}
            onChange={(e) => handleInputChange('Note', e.target.value)}
            placeholder="Enter additional notes"
          />
        </Form.Item>

        <Form.Item label="Content" style={styles.formItem}>
          <Input.TextArea
            rows={7}
            value={formDraft.Content || ''}
            onChange={(e) => handleInputChange('Content', e.target.value)}
            placeholder="Enter the content"
          />
        </Form.Item>

        <Form.Item label="Definition" style={styles.formItem}>
          <Input.TextArea
            rows={3}
            value={formDraft.Definition || ''}
            onChange={(e) => handleInputChange('Definition', e.target.value)}
            placeholder="Enter the definition"
          />
        </Form.Item>

        <Form.Item label="Priority" style={styles.formItem}>
          <Input
            value={formDraft.Priority || ''}
            onChange={(e) => handleInputChange('Priority', e.target.value)}
            placeholder="Enter the priority level"
          />
        </Form.Item>

        <Form.Item label="Current Status" style={styles.formItem}>
          <Input.TextArea
            rows={3}
            value={formDraft.Current_status || ''}
            onChange={(e) => handleInputChange('Current_status', e.target.value)}
            placeholder="Enter the current status"
          />
        </Form.Item>

        <Form.Item label="Deadline" style={styles.formItem}>
          <Input
            value={formDraft.Deadline || ''}
            onChange={(e) => handleInputChange('Deadline', e.target.value)}
            placeholder="Enter the deadline"
          />
        </Form.Item>

        {/* Disabled fields for empty properties */}
        <Form.Item label="Difficulty Rating" style={styles.formItem}>
          <Input.TextArea rows={1} placeholder="Currently empty" disabled />
        </Form.Item>

        <Form.Item label="Relationship to Others" style={styles.formItem}>
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
