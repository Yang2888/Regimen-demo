import React, { useContext, useEffect, useState } from 'react';
import { Input, Button, Form } from 'antd';
import { DataContext } from './dataProcess/dataContext'; // Import the context

const GenerateContent = () => {
  const { data_global, updateDataGlobal, set_node_displayed, node_displayed, edit_certain_node } = useContext(DataContext); // Access data from context
  const [formData, setFormData] = useState({}); // Initialize state to hold original form data
  const [formDraft, setFormDraft] = useState({}); // Initialize state to hold draft form data
  const [fieldEditable, setFieldEditable] = useState({}); // State to track editable status for each field

  // Load the JSON data into the form on component mount
  useEffect(() => {
    if (node_displayed) {
      setFormData(node_displayed); // Store original data in formData
      setFormDraft(node_displayed); // Sync formDraft with node_displayed
      // Initialize all fields as non-editable
      const initialEditableState = {};
      Object.keys(node_displayed).forEach(key => {
        initialEditableState[key] = false; // All fields start as non-editable
      });
      setFieldEditable(initialEditableState);
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

  // Toggle the editability of a field
  const toggleEditable = (field) => {
    setFieldEditable((prevState) => ({
      ...prevState,
      [field]: !prevState[field], // Toggle between true and false
    }));
    console.log(fieldEditable)
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Generate Goal</h2>
      <Form layout="vertical">
        {/* Title field with edit toggle */}
        <Form.Item label={
          <>
            Title
            <Button
              type="link"
              onClick={() => toggleEditable('Title')}
              style={{ marginLeft: 10 }}
            >
              {fieldEditable.Title ? 'Lock' : 'Edit'}
            </Button>
          </>
        } style={styles.formItem}>
          <Input
            value={formDraft.Title || ''}
            onChange={(e) => handleInputChange('Title', e.target.value)}
            placeholder="Enter the goal title"
            disabled={!fieldEditable.Title} // Disable if not editable
          />
        </Form.Item>

        {/* Repeat this pattern for other fields */}
        <Form.Item label={
          <>
            Summary
            <Button
              type="link"
              onClick={() => toggleEditable('Summary')}
              style={{ marginLeft: 10 }}
            >
              {fieldEditable.Summary ? 'Lock' : 'Edit'}
            </Button>
          </>
        } style={styles.formItem}>
          <Input.TextArea
            rows={3}
            value={formDraft.Summary || ''}
            onChange={(e) => handleInputChange('Summary', e.target.value)}
            placeholder="Enter a brief summary"
            disabled={!fieldEditable.Summary}
          />
        </Form.Item>

        <Form.Item label={
          <>
            Note
            <Button
              type="link"
              onClick={() => toggleEditable('Note')}
              style={{ marginLeft: 10 }}
            >
              {fieldEditable.Note ? 'Lock' : 'Edit'}
            </Button>
          </>
        } style={styles.formItem}>
          <Input.TextArea
            rows={7}
            value={formDraft.Note || ''}
            onChange={(e) => handleInputChange('Note', e.target.value)}
            placeholder="Enter additional notes"
            disabled={!fieldEditable.Note}
          />
        </Form.Item>

        <Form.Item label={
          <>
            Content
            <Button
              type="link"
              onClick={() => toggleEditable('Content')}
              style={{ marginLeft: 10 }}
            >
              {fieldEditable.Content ? 'Lock' : 'Edit'}
            </Button>
          </>
        } style={styles.formItem}>
          <Input.TextArea
            rows={7}
            value={formDraft.Content || ''}
            onChange={(e) => handleInputChange('Content', e.target.value)}
            placeholder="Enter the content"
            disabled={!fieldEditable.Content}
          />
        </Form.Item>

        {/* Buttons for cancel and confirm */}
        <div style={styles.buttonGroup}>
          <Button onClick={onCancel} style={styles.cancelButton}>
            Reset
          </Button>
          <Button type="primary" onClick={handleConfirm} style={styles.confirmButton}>
            Generate
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

export default GenerateContent;
