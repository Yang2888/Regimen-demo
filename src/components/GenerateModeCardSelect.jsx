import React, { useContext, useEffect, useState } from 'react';
import { Input, Button, Form, Row, Col, Card } from 'antd';
import { DataContext } from './dataProcess/dataContext';

const GenerateContentSelect = ({confirmGenerate= ()=>{}} ) => {
  const { node_displayed, edit_certain_node } = useContext(DataContext); // Access data from context
  const [formData, setFormData] = useState({}); // Initialize state to hold original form data
  const [formDraft, setFormDraft] = useState({}); // Initialize state to hold draft form data
  // const [milestoneStatus, setMilestoneStatus] = useState([]); // Initialize state to track the keep/delete status of milestones
  const [fieldEditable, setFieldEditable] = useState({}); // Track the editable status for each field

  const editAllLock = () => {
    const initialEditableState = {};
      Object.keys(node_displayed).forEach(key => {
        initialEditableState[key] = false; // All fields start as non-editable
      });
      setFieldEditable(initialEditableState);
  }

  const editAllOpen = () => {
    const initialEditableState = {};
      Object.keys(node_displayed).forEach(key => {
        initialEditableState[key] = true; // All fields start as non-editable
      });
      setFieldEditable(initialEditableState);
  }

  const editAllCounter = () => {
    const initialEditableState = {};
      Object.keys(fieldEditable).forEach(key => {
        initialEditableState[key] = !fieldEditable[key]; // All fields start as non-editable
      });
      setFieldEditable(initialEditableState);
  }

  const editMilestones = () => {
    const initialEditableState = {};
      Object.keys(fieldEditable).forEach(key => {
        initialEditableState[key] = false; // All fields start as non-editable
      });
      initialEditableState['children'] = true
      setFieldEditable(initialEditableState);
  }



  // Handle input change for two-way binding
  const handleInputChange = (field, value) => {
    // console.log(formDraft)
    setFormDraft((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Toggle the editability of a field
  const toggleEditable = (field) => {
    setFieldEditable((prevState) => ({
      ...prevState,
      [field]: !prevState[field], // Toggle between true and false
    }));
  };

  const handleConfirm = () => {
    setFormData(formDraft); // Save the draft as the new original data
    confirmGenerate(formDraft, fieldEditable)
  };

  const onCancel = () => {
    setFormDraft(formData); // Sync formDraft back to formData
  };
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Generate Regimen With Input</h2>

      {/* <div style={styles.buttonGroup}>
        <Button type="primary" onClick={() => editAllOpen()} style={styles.selectButton}>
          Edit All
        </Button>
        <Button type="primary" onClick={() => editAllLock()} style={styles.selectButton}>
          Edit None
        </Button>
        <Button type="primary" onClick={() => editAllCounter() } style={styles.selectButton}>
          Reverse
        </Button>
        <Button type="primary" onClick={() => editMilestones() } style={styles.selectButton}>
          Edit Milestones
        </Button>
      </div> */}

      <Form layout="vertical">
      {/* <Form.Item label={
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
  </Form.Item> */}

  <Form.Item label={
    <>
      Content
      {/* <Button
        type="link"
        onClick={() => toggleEditable('Note')}
        style={{ marginLeft: 10 }}
      >
        {fieldEditable.Note ? 'Lock' : 'Edit'}
      </Button> */}
    </>
  } style={styles.formItem}>
    <Input.TextArea
      rows={7}
      value={formDraft.Content || ''}
      onChange={(e) => handleInputChange('Content', e.target.value)}
      placeholder="Enter additional notes"
      disabled={false}
    />
  </Form.Item>
{/* 
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

  <Form.Item label={
    <>
      Definition
      <Button
        type="link"
        onClick={() => toggleEditable('Definition')}
        style={{ marginLeft: 10 }}
      >
        {fieldEditable.Definition ? 'Lock' : 'Edit'}
      </Button>
    </>
  } style={styles.formItem}>
    <Input.TextArea
      rows={3}
      value={formDraft.Definition || ''}
      onChange={(e) => handleInputChange('Definition', e.target.value)}
      placeholder="Enter the definition"
      disabled={!fieldEditable.Definition}
    />
  </Form.Item>

  <Form.Item label={
    <>
      Priority
      <Button
        type="link"
        onClick={() => toggleEditable('Priority')}
        style={{ marginLeft: 10 }}
      >
        {fieldEditable.Priority ? 'Lock' : 'Edit'}
      </Button>
    </>
  } style={styles.formItem}>
    <Input
      value={formDraft.Priority || ''}
      onChange={(e) => handleInputChange('Priority', e.target.value)}
      placeholder="Enter the priority level"
      disabled={!fieldEditable.Priority}
    />
  </Form.Item>

  <Form.Item label={
    <>
      Current Status
      <Button
        type="link"
        onClick={() => toggleEditable('Current_status')}
        style={{ marginLeft: 10 }}
      >
        {fieldEditable.Current_status ? 'Lock' : 'Edit'}
      </Button>
    </>
  } style={styles.formItem}>
    <Input.TextArea
      rows={3}
      value={formDraft.Current_status || ''}
      onChange={(e) => handleInputChange('Current_status', e.target.value)}
      placeholder="Enter the current status"
      disabled={!fieldEditable.Current_status}
    />
  </Form.Item>

  <Form.Item label={
    <>
      Deadline
      <Button
        type="link"
        onClick={() => toggleEditable('Deadline')}
        style={{ marginLeft: 10 }}
      >
        {fieldEditable.Deadline ? 'Lock' : 'Edit'}
      </Button>
    </>
  } style={styles.formItem}>
    <Input
      value={formDraft.Deadline || ''}
      onChange={(e) => handleInputChange('Deadline', e.target.value)}
      placeholder="Enter the deadline"
      disabled={!fieldEditable.Deadline}
    />
  </Form.Item> */}

       

        <div style={styles.buttonGroup}>
          <Button onClick={onCancel} style={styles.cancelButton}>
            Cancel
          </Button>
          <Button type="primary" disabled={false} onClick={handleConfirm} style={styles.confirmButton}>
            Confirm
          </Button>
        </div>
      </Form>
    </div>
  );
};

// Inline styles for improved layout and spacing
const styles = {
  container: {
    maxWidth: '1200px', 
    margin: '0 auto',
    padding: '30px',
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
  milestoneCard: {
    marginBottom: '15px',
    backgroundColor: '#fafafa',
    padding: '15px',
    borderRadius: '6px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },

  milestoneCardDisabled: {
    marginBottom: '15px',
    backgroundColor: '#f0f0f0',
    padding: '15px',
    borderRadius: '6px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },

  milestoneButtonGroup: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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

  selectButton: {
    marginRight: '10px', 
    backgroundColor: '#ff8e1c',

  },

  milestonesHeading: {
    display: 'inline',
    fontSize: '16px', // Adjust the size as needed
    fontWeight: 'bold', // Make it bold
    margin: 0,
    padding: 0,
  },

  formItem: {
    marginBottom: '16px',
    fontSize: '1.75em', // Typical size for h3
    fontWeight: 'bold', // Make it bold like h3
    lineHeight: '1.2',  // Adjust line height similar to h3
    marginTop: '1em',   // Add some space above like h3
  },
};

export default GenerateContentSelect;
 