import React, { useContext, useEffect, useState } from 'react';
import { Typography, Button, Row, Col, Divider } from 'antd';
import { DataContext } from './dataProcess/dataContext'; // Import the context

const { Text, Title } = Typography;

const DisplayContent = ({ onCancel }) => {
  const { node_displayed } = useContext(DataContext); // Access data from context
  const [formData, setFormData] = useState({}); // Initialize state to hold form data

  // Load the JSON data on component mount
  useEffect(() => {
    if (node_displayed && node_displayed) {
      setFormData(node_displayed); // Set the formData from context data
    }
  }, [node_displayed]);

  const renderField = (label, value) => (
    <Row style={styles.fieldRow}>
      <Col span={6} style={styles.label}>
        <Text strong style={styles.labelText}>{label}</Text>
      </Col>
      <Col span={18} style={styles.value}>
        <Text>{value || 'N/A'}</Text>
      </Col>
    </Row>
  );

  return (
    <div style={styles.container}>
      <Title level={2} style={styles.title}>Goal Overview</Title>

      {renderField('Title', formData.Title)}
      {renderField('Summary', formData.Summary)}
      {renderField('Note', formData.Note)}
      {renderField('Content', formData.Content)}
      {renderField('Definition', formData.Definition)}
      {renderField('Priority', formData.Priority)}
      {renderField('Current Status', formData.Current_status)}
      {renderField('Deadline', formData.Deadline)}
      {renderField('Difficulty Rating', formData.difficulty_rating ? JSON.stringify(formData.difficulty_rating) : 'Currently empty')}
      {renderField('Relationship to Others', formData.relationship_to_others ? JSON.stringify(formData.relationship_to_others) : 'Currently empty')}

      <Divider style={styles.divider} />

      {/* Button for cancel */}
      <div style={styles.buttonGroup}>
        <Button onClick={onCancel} style={styles.cancelButton}>
          Close
        </Button>
      </div>
    </div>
  );
};

// Inline styles for improved layout and spacing
const styles = {
  container: {
    maxWidth: '1200px', // Increased width
    margin: '0 auto',
    padding: '30px', // Added padding for a more spacious layout
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Added subtle shadow for depth
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  fieldRow: {
    padding: '15px 0', // Increased vertical spacing between each row
    borderBottom: '2px solid #eee', // Bolder lines to separate fields
  },
  label: {
    fontWeight: 'bold',
    color: '#333', // Darker color for labels
    paddingRight: '15px', // Space between label and value
  },
  labelText: {
    fontSize: '16px', // Bigger font size for the labels
    fontWeight: '700', // Bold font weight
  },
  value: {
    color: '#555', // Slightly darker for the values
    fontSize: '14px', // Slightly smaller for readability
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '30px',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    color: 'white',
    borderRadius: '4px',
  },
  divider: {
    margin: '20px 0',
    borderColor: '#ddd',
  },
};

export default DisplayContent;
