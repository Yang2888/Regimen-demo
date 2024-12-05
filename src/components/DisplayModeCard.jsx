import React, { useContext, useEffect, useState } from 'react';
import { Typography, Button, Row, Col, Divider, Card, Modal } from 'antd';
import { DataContext } from './dataProcess/dataContext'; // Import the context


const { Text, Title } = Typography;

const DisplayContent = () => {
  const { node_displayed, delete_certain_node } = useContext(DataContext); // Access data from context
  const [formData, setFormData] = useState({}); // Initialize state to hold form data
  const toggleDrugStatus = (e) => {

  }
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

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    delete_certain_node(node_displayed);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderMilestones = (milestones) => (
    <div>
      <Title level={3} style={styles.milestoneTitle}>Milestones</Title>
      {milestones && milestones.length > 0 ? (
        milestones.map((milestone, index) => (
          <Card key={index} style={styles.milestoneCard} bordered={false}>
            <Title level={4} style={styles.milestoneIndex}>
              {index + 1}. {milestone.Title}
            </Title>
            <Text style={styles.milestoneSummary}>{milestone.Summary || 'No summary available'}</Text>
            <Divider style={styles.milestoneDivider} />
          </Card>
        ))
      ) : (
        <Text>No milestones available.</Text>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <Title level={2} style={styles.title}>Details</Title>

      {renderField('Title', formData.Title)}
      {renderField('Summary', formData.Summary)}
      {/* {renderField('Note', formData.Note)} */}
      {renderField('Content', formData.Content)}
      {renderField('Note By Doctor', formData.Note)}
      {renderField('Note By Patient', formData.Current_status)}
      {/* {renderField('Definition', formData.Definition)} */}
      {/* {renderField('Priority', formData.Priority)} */}
      {/* {renderField('Current Status', formData.Current_status)} */}
      {/* {renderField('Deadline', formData.Deadline)} */}
      {/* {renderField('Difficulty Rating', formData.difficulty_rating ? JSON.stringify(formData.difficulty_rating) : 'Currently empty')} */}
      {/* {renderField('Relationship to Others', formData.relationship_to_others ? JSON.stringify(formData.relationship_to_others) : 'Currently empty')} */}

      {/* <Divider style={styles.divider} /> */}

      {/* Render Milestones if available */}
      {/* {renderMilestones(formData.children)} */}

      {/* Button for cancel */}
      <div style={styles.buttonGroup}>
        {/* <Button onClick={toggleDrugStatus} type="primary">Toggle Drug Status</Button> */}
      {/* <Button onClick={showModal} style={styles.cancelButton}>
        Delete
      </Button>
      <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>
  Are you sure you want to delete this node? <br />
  Node title:
  <span style={{ fontSize: '16px', fontWeight: 'bold', fontStyle: 'italic', marginLeft: '8px' }}>
    {node_displayed.Title}
  </span>
</p>
      </Modal> */}
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
  milestoneTitle: {
    marginTop: '20px',
    color: '#333',
  },
  milestoneCard: {
    marginBottom: '15px', // Spacing between milestone cards
    backgroundColor: '#fafafa', // Light background for milestones
    padding: '15px', // Padding inside each card
    borderRadius: '6px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for each milestone
  },
  milestoneIndex: {
    fontWeight: 'bold',
    color: '#3f51b5', // Accent color for milestone index and title
  },
  milestoneSummary: {
    display: 'block', // Ensure the summary is displayed as a block element
    marginTop: '8px', // Spacing below the title
    color: '#666', // Lighter text color for summary
  },
  milestoneDivider: {
    marginTop: '10px',
    borderColor: '#eee',
  },
};

export default DisplayContent;
