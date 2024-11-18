import React, { useContext, useEffect, useState } from 'react';
import { Input, Button, Form, Row, Col, Card } from 'antd';
import { DataContext } from './dataProcess/dataContext'; // Import the context

const QAContent = () => {
  const { node_displayed, edit_certain_node, data_global, set_node_displayed } = useContext(DataContext);
  const [formData, setFormData] = useState({});
  const [formDraft, setFormDraft] = useState({});
  const [milestoneStatus, setMilestoneStatus] = useState([]);

  useEffect(() => {
    if (node_displayed) {
      setFormData(node_displayed);
      setFormDraft({
        ...node_displayed,
        "Question": "",
      })
      setFormDraft({
        ...node_displayed,
        "Question": "",
      });

      if (node_displayed.children) {
        setMilestoneStatus(node_displayed.children.map(() => true));
        console.log(milestoneStatus)
      }
    }
  }, [node_displayed]);

  const handleInputChange = (field, value) => {
    setFormDraft((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleConfirm = () => {
    alert("This will return the output of the fine-tuned model in the future. Currently only this pop-out. ")
  };

  const onCancel = () => {
    setFormDraft(formData);
  };

  const [textareaValue, setTextareaValue] = useState('');

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Ask any question</h2>
      <Form layout="vertical">
      <Form.Item label="Question">
        <Input.TextArea
          rows={4}
          value={textareaValue}
          onChange={handleTextareaChange}
          placeholder="Enter question"
        />
      </Form.Item>

        <div style={styles.buttonGroup}>
          <Button onClick={onCancel} style={styles.cancelButton}>Cancel</Button>
          <Button type="primary" onClick={handleConfirm} style={styles.confirmButton}>Confirm</Button>
        </div>
      </Form>
    </div>
  );
};

// FormItem Component for rendering form fields
const FormItem = ({ label, value, onChange, field, type = 'input', rows }) => (
  <Form.Item label={label} style={styles.formItem}>
    {type === 'textarea' ? (
      <Input.TextArea
        rows={rows || 3}
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={`Enter the ${label.toLowerCase()}`}
      />
    ) : (
      <Input
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={`Enter the ${label.toLowerCase()}`}
      />
    )}
  </Form.Item>
);

// MilestoneList Component
const MilestoneList = ({ milestones, milestoneStatus, handleMilestoneAction }) => (
  milestones.length > 0 && (
    <div>
      <h3>Milestones</h3>
      {milestones.map((milestone, index) => (
        <Card key={index} bodyStyle={{ padding: '0' }} style={styles.milestoneCard}>
          <Row>
            <Col span={16}>
              <h3>{index + 1}. {milestone.Title}</h3>
              <p>{milestone.Summary || 'No summary available'}</p>
            </Col>
            <Col span={8} style={styles.milestoneButtonGroup}>
              {milestoneStatus[index] ? (
                <Button type="primary" onClick={() => handleMilestoneAction(index, 'delete')}>Delete</Button>
              ) : (
                <Button type="default" onClick={() => handleMilestoneAction(index, 'keep')}>Keep</Button>
              )}
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  )
);

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
    fontSize: '1.75em',
    fontWeight: 'bold',
    lineHeight: '1.2',
    marginTop: '1em',
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
};

export default QAContent;
