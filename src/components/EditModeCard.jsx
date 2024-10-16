import React, { useContext, useEffect, useState } from 'react';
import { Input, Button, Form, Row, Col, Card } from 'antd';
import { DataContext } from './dataProcess/dataContext'; // Import the context
import { formatCountdown } from 'antd/es/statistic/utils';

const EditContent = () => {
  const { node_displayed, edit_certain_node } = useContext(DataContext); // Access data from context
  const [formData, setFormData] = useState({}); // Initialize state to hold original form data
  const [formDraft, setFormDraft] = useState({}); // Initialize state to hold draft form data
  const [milestoneStatus, setMilestoneStatus] = useState([]); // Initialize state to track the keep/delete status of milestones

  // Load the JSON data into the form on component mount
  useEffect(() => {
    if (node_displayed) {
      setFormData(node_displayed); // Store original data in formData
      setFormDraft(node_displayed); // Sync formDraft with node_displayed

      // Initialize the milestone status (true = keep, false = delete)
      if (node_displayed.children) {
        setMilestoneStatus(node_displayed.children.map(() => true)); // Default: keep all milestones
      }
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
    console.log(formDraft)
    const updatedMilestones = formDraft.children.filter((_, index) => milestoneStatus[index]); // Only keep milestones marked as "kept"
    const updatedFormDraft = { ...formDraft, children: updatedMilestones };
    // console.log(updatedFormDraft)
    setMilestoneStatus(node_displayed.children.map(() => true));

    setFormData(updatedFormDraft); // Save the draft as the new original data
    setFormDraft(updatedFormDraft); // Save the draft as the new original data
    edit_certain_node(updatedFormDraft); // Update the global context or save the changes
    // console.log(updatedMilestones)
    // console.log(milestoneStatus)
  };

  const onCancel = () => {
    // Reset formDraft to the original formData
    setFormDraft(formData); // Sync formDraft back to formData
  };

  // Handle "keep" or "delete" action for milestones
  const handleMilestoneAction = (index, action) => {
    setMilestoneStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index] = action === 'keep'; // Set true for "keep" and false for "delete"
      return newStatus;
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Goal</h2>

      <Form layout="vertical">
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

        {/* Render milestones with "Keep" and "Delete" buttons */}
        {formDraft.children && formDraft.children.length > 0 && (
          <div>
            <h3>Milestones</h3>
            {formDraft.children.map((milestone, index) => (
              <Card  bodyStyle={{ padding: '0' }}  key={index} style={styles.milestoneCard}>
                <Row>
                  <Col span={16}>
                    <h3>{index + 1}. {milestone.Title}</h3>
                    <p>{milestone.Summary || 'No summary available'}</p>
                  </Col>
                  <Col span={8} style={styles.milestoneButtonGroup}>
                    {milestoneStatus[index] ? (
                      <Button
                        type="primary"
                        onClick={() => handleMilestoneAction(index, 'delete')}
                      >
                        Delete
                      </Button>
                    ) : (
                      <Button
                        type="default"
                        onClick={() => handleMilestoneAction(index, 'keep')}
                      >
                        Keep
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        )}

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
  milestoneButtonGroup: {
    display: 'flex',
    justifyContent: 'center', // Center the buttons horizontally
    alignItems: 'center', // Center the buttons vertically (if needed)
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
