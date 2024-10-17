import React, { useContext, useEffect, useState } from 'react';
import { Input, Button, Form, Row, Col, Card, Typography } from 'antd';
import { DataContext } from './dataProcess/dataContext'; // Import the context

const { Text, Title } = Typography;

const FinalEditContentCard = ({generatedData}) => {
  const { node_displayed, edit_certain_node, data_global, set_node_displayed } = useContext(DataContext);
  const [formData, setFormData] = useState({});
  const [formDraft, setFormDraft] = useState({});
  const [milestoneStatusOrig, setMilestoneStatusOrig] = useState([]);
  const [milestoneStatusGene, setMilestoneStatusGene] = useState([]);

  useEffect(() => {
      setFormData(node_displayed);
    //   setFormDraft(generatedData);

      setFormDraft({
        ...generatedData,
        "uid": node_displayed.uid,
      })

      if (node_displayed.children) {
        setMilestoneStatusOrig(node_displayed.children.map(() => true));
        setMilestoneStatusGene(generatedData.children.map(() => true));
        // console.log(milestoneStatusGene)
        // console.log(milestoneStatusOrig)
      }
  }, [node_displayed]);

  const handleInputChange = (field, value) => {
    setFormDraft((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const onGeneratedClick = (field) => {
    // console.log(field)
    // console.log(generatedData[field])
    setFormDraft((prevState) => ({
        ...prevState,
        [field]: generatedData[field],
      }));
  }


  const onOriginalClick = (field) => {
    // console.log(field)
    // console.log(formData[field])
    
    setFormDraft((prevState) => ({
        ...prevState,
        [field]: formData[field],
      }));
  }

  const handleConfirm = () => {
    const updatedMilestones1 = node_displayed.children.filter((_, index) => milestoneStatusOrig[index]);
    const updatedMilestones2 = generatedData.children.filter((_, index) => milestoneStatusGene[index]);

    const mergedMilestones = [...updatedMilestones1, ...updatedMilestones2];

    const updatedFormDraft = { ...formDraft, children: mergedMilestones };
    
    setMilestoneStatusOrig(node_displayed.children.map(() => true));
    setMilestoneStatusGene(generatedData.children.map(() => true));
    // setFormData(generatedData);
    setFormDraft(updatedFormDraft)
    edit_certain_node(updatedFormDraft);
    set_node_displayed(updatedFormDraft);
    console.log(updatedFormDraft)
    console.log(data_global)
  };

  const onCancel = () => {
    setFormDraft(formData);
  };

  const handleMilestoneAction1 = (index, action) => {
    setMilestoneStatusOrig((prevStatus) => {
        console.log(prevStatus)
      const newStatus = [...prevStatus];
      newStatus[index] = action === 'keep';
      return newStatus;
    });
  };
  
  const handleMilestoneAction2 = (index, action) => {
    setMilestoneStatusGene((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index] = action === 'keep';
      return newStatus;
    });
  };

  
  // Set all elements in the array to true
const allTrue = (arr) => {
    return arr.map(() => true);
  };
  
  // Set all elements in the array to false
  const allFalse = (arr) => {
    return arr.map(() => false);
  };
  
  // Reverse the boolean values in the array
  const reverseSta = (arr) => {
    return arr.map(value => !value);
  };
  

  const allOriginal = () => {
    setFormDraft(node_displayed)
    setMilestoneStatusOrig(allTrue(milestoneStatusOrig))
    setMilestoneStatusGene(allFalse(milestoneStatusGene))
  }

  const allGenerated = ( ) => {
    setFormDraft(generatedData)
    setMilestoneStatusOrig(allFalse(milestoneStatusOrig))
    setMilestoneStatusGene(allTrue(milestoneStatusGene))
  }


  const nonMiles = () => {
    setMilestoneStatusOrig(allFalse(milestoneStatusOrig))
    setMilestoneStatusGene(allFalse(milestoneStatusGene))
  }

  const allMiles = () => {
    setMilestoneStatusOrig(allTrue(milestoneStatusOrig))
    setMilestoneStatusGene(allTrue(milestoneStatusGene))
  }

  const onlyGenMiles = () => {
    setMilestoneStatusOrig(allFalse(milestoneStatusOrig))
    setMilestoneStatusGene(allTrue(milestoneStatusGene))
  }

  const onlyOriMiles = () => {
    setMilestoneStatusOrig(allTrue(milestoneStatusOrig))
    setMilestoneStatusGene(allFalse(milestoneStatusGene))
  }

  const reverseMils = () => {

    setMilestoneStatusOrig(reverseSta(milestoneStatusOrig))
    setMilestoneStatusGene(reverseSta(milestoneStatusGene))
  }


  return (
    <div style={styles.container}>
     <Title level={2} style={styles.title}>Goal Overview</Title>
     <div style={{ display: 'flex', justifyContent: 'center',  marginBottom: '16px' }}>
  <Button type="default" style={{marginRight: '20px'}} onClick={allOriginal}>All Original</Button>
  <Button type="primary" onClick={allGenerated}>All Generated</Button>
</div>
      <Form layout="vertical">
      <FormItem label="Title" value={formDraft.Title} onChange={handleInputChange} onOriginalClick={onOriginalClick} onGeneratedClick={onGeneratedClick} field="Title" />
        <FormItem label="Summary" value={formDraft.Summary} onChange={handleInputChange} onOriginalClick={onOriginalClick} onGeneratedClick={onGeneratedClick} field="Summary" type="textarea" rows={3} />
        <FormItem label="Note" value={formDraft.Note} onChange={handleInputChange} onOriginalClick={onOriginalClick} onGeneratedClick={onGeneratedClick} field="Note" type="textarea" rows={7} />
        <FormItem label="Content" value={formDraft.Content} onChange={handleInputChange} onOriginalClick={onOriginalClick} onGeneratedClick={onGeneratedClick} field="Content" type="textarea" rows={7} />
        <FormItem label="Definition" value={formDraft.Definition} onChange={handleInputChange} onOriginalClick={onOriginalClick} onGeneratedClick={onGeneratedClick} field="Definition" type="textarea" rows={3} />
        <FormItem label="Priority" value={formDraft.Priority} onChange={handleInputChange} onOriginalClick={onOriginalClick} onGeneratedClick={onGeneratedClick} field="Priority" />
        <FormItem label="Current Status" value={formDraft.Current_status} onChange={handleInputChange} onOriginalClick={onOriginalClick} onGeneratedClick={onGeneratedClick} field="Current_status" type="textarea" rows={3} />
        <FormItem label="Deadline" value={formDraft.Deadline} onChange={handleInputChange} onOriginalClick={onOriginalClick} onGeneratedClick={onGeneratedClick} field="Deadline" />

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
  <Button type="default" style={{marginRight: '20px', marginBottom: '10px'}} onClick={allMiles}>All</Button>
  <Button type="default" style={{marginRight: '20px', marginBottom: '10px'}} onClick={nonMiles}>None</Button>
  <Button type="default" style={{marginRight: '20px', marginBottom: '10px'}} onClick={reverseMils}>Reverse</Button>
  <Button type="default" style={{marginRight: '20px', marginBottom: '10px'}} onClick={onlyOriMiles}>Original</Button>
  <Button type="default" style={{marginBottom: '10px'}} onClick={onlyGenMiles}>Generated</Button>
</div>


        <MilestoneList
          milestones={node_displayed.children || []}
          milestoneStatus={milestoneStatusOrig}
          handleMilestoneAction={handleMilestoneAction1}
          name={"Milestone - Original"}
        />

        <MilestoneList
          milestones={generatedData.children || []}
          milestoneStatus={milestoneStatusGene}
          handleMilestoneAction={handleMilestoneAction2}
          name={"Milestone - Generated"}
        />

        <div style={styles.buttonGroup}>
          <Button onClick={onCancel} style={styles.cancelButton}>Cancel</Button>
          <Button type="primary" onClick={handleConfirm} style={styles.confirmButton}>Confirm</Button>
        </div>
      </Form>
    </div>
  );
};

const FormItem = ({ label, value, onChange, field, type = 'input', rows, onOriginalClick, onGeneratedClick }) => (
    <Form.Item
      label={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
  {/* Label on the first line */}
  <span style={{ marginBottom: '8px' }}>{label}</span>
  
  {/* Buttons on the next line */}
  <div style={{ display: 'flex', gap: '8px' }}>
    <Button
      type="default"
      size="small"
      onClick={() => onOriginalClick(field)}
    >
      Original
    </Button>
    <Button
      type="primary"
      size="small"
      onClick={() => onGeneratedClick(field)}
    >
      Generated
    </Button>
  </div>
</div>
      }
      style={styles.formItem}
    >
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
const MilestoneList = ({ milestones, milestoneStatus, handleMilestoneAction, name }) => (
   (
    <div>
      <h3>{name}</h3>
      {milestones  && milestones.map((milestone, index) => (
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
// Inline styles for improved layout and spacing
const styles = {
    container: {
      maxWidth: '1200px', // Increased width
      margin: '10px',
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
    formItem: {
        marginBottom: '16px',
        fontSize: '1.75em',
        fontWeight: 'bold',
        lineHeight: '1.2',
        marginTop: '1em',
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
      milestoneButtonGroup: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
  };
export default FinalEditContentCard;
