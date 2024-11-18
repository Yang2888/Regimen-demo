import React, { useContext, useEffect, useState } from 'react';
import { Input, Button, Form, Row, Col, Card, Layout } from 'antd';
import { DataContext } from './dataProcess/dataContext'; // Import the context
import { createNodeWithUID } from './dataProcess/initData';

const { Sider } = Layout;

const EditContent = () => {
  const { node_displayed, edit_certain_node, data_global, set_node_displayed } = useContext(DataContext);
  const [formData, setFormData] = useState({});
  const [formDraft, setFormDraft] = useState({});
  const [milestoneStatus, setMilestoneStatus] = useState([]);

  useEffect(() => {
    if (node_displayed) {
      setFormData(node_displayed);
      setFormDraft(node_displayed);

      if (node_displayed.children) {
        setMilestoneStatus(node_displayed.children.map(() => true));
        // console.log(milestoneStatus)
      }
    }
  }, [node_displayed]);

  const   handleInputChange = (field, value) => {
    setFormDraft((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleConfirm = () => {
    const updatedMilestones = formDraft.children.filter((_, index) => milestoneStatus[index]);
    const updatedFormDraft = { ...formDraft, children: updatedMilestones };
    
    setMilestoneStatus(node_displayed.children.map(() => true));
    setFormData(updatedFormDraft);
    setFormDraft(updatedFormDraft);
    edit_certain_node(updatedFormDraft);
    set_node_displayed(updatedFormDraft);
  };

  const onCancel = () => {
    setFormDraft(formData);
  };

  const handleMilestoneAction = (index, action) => {
    setMilestoneStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index] = action === 'keep';
      return newStatus;
    });
  };

  const addMilestoneAction = () => {
    setFormDraft((prev)=> {
      let prev_children = prev.children.map(e=>e)
      prev_children.push(createNodeWithUID(prev.children.length))
      console.log(prev_children)
      return {
        ...prev,
        children: prev_children,
      }
    })

    setMilestoneStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus.push(true)
      return newStatus;
    })
  }

  const handleFileUpload_1 = (event) => {
    console.log(formDraft)
    const file = event.target.files[0]; // Get the uploaded file
    if (file && file.type === "application/json") { // Check if the file is a JSON file
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result; // Read the content of the file
        try {
          const jsonData = JSON.parse(fileContent); // Parse the JSON content

          jsonData["uid"] = formDraft["uid"]
          console.log(jsonData)
    console.log(formDraft)

          setFormDraft(jsonData)
          // updateDataGlobal(jsonData); // Update the context with the parsed data
          // set_node_displayed(jsonData); // Update the context with the parsed data
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file); // Read the file as text
    } else {
      console.error("Please upload a valid JSON file");
    }
    // handleResetPos()
    event.target.value = null
  };

  const handleButtonClick_1 = () => {
    document.getElementById('fileInput_combination').click(); // Programmatically click the file input
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit / Add Info</h2>
      {/* <Sider style={{ backgroundColor: '#FFFFFF', padding: '20px' }}> */}
        {/* <input
          id="fileInput_combination"
          type="file"
          style={{ display: 'none' }} // Hide the file input element
          accept=".json"
          onChange={handleFileUpload_1} // Handle file selection
        /> */}
        {/* <Button
          onClick={handleButtonClick_1} // Trigger file upload on button click
          type="primary"
          style={{ marginBottom: '20px', padding: '25px', width: '100%' }}
        >
          Read Data
        </Button> */}

      {/* </Sider> */}
      <Form layout="vertical">
        <FormItem label="Title" value={formDraft.Title} onChange={handleInputChange} field="Title" />
        <FormItem label="Summary" value={formDraft.Summary} onChange={handleInputChange} field="Summary" type="textarea" rows={3} />
        <FormItem label="Content" value={formDraft.Content} onChange={handleInputChange} field="Content" type="textarea" rows={7} />
        <FormItem label="Note By Doc" value={formDraft.Note} onChange={handleInputChange} field="Note" type="textarea" rows={7} />
        <FormItem label="Note By Patient" value={formDraft.Current_status} onChange={handleInputChange} field="Current_status" type="textarea" rows={7} />
        {/* <FormItem label="Definition" value={formDraft.Definition} onChange={handleInputChange} field="Definition" type="textarea" rows={3} />
        <FormItem label="Priority" value={formDraft.Priority} onChange={handleInputChange} field="Priority" />
        <FormItem label="Current Status" value={formDraft.Current_status} onChange={handleInputChange} field="Current_status" type="textarea" rows={3} />
        <FormItem label="Deadline" value={formDraft.Deadline} onChange={handleInputChange} field="Deadline" />

        <MilestoneList
          milestones={formDraft.children || []}
          milestoneStatus={milestoneStatus}
          handleMilestoneAction={handleMilestoneAction}
          addMilestoneAction={addMilestoneAction}
        /> */}

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
const MilestoneList = ({ milestones, milestoneStatus, handleMilestoneAction, addMilestoneAction }) => (
  // milestones.length > 0 && (
    (
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
      <Card key={114514} bodyStyle={{ padding: '0' }} style={styles.milestoneCard}>
          <Row>
            {/* <Col span={16}>
              <h3>{index + 1}. {milestone.Title}</h3>
              <p>{milestone.Summary || 'No summary available'}</p>
            </Col> */}
            <Col span={24} style={styles.milestoneButtonGroup}>
              <Button style={{width:"60%"}} type="primary" onClick={() => addMilestoneAction()}>Add</Button>
            </Col>
          </Row>
        </Card>
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

export default EditContent;
