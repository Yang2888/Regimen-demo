import React, { useState, useContext, createContext } from 'react';
import { Button, Card, Spin, Modal } from 'antd';
import GenerateContentSelect from './GenerateModeCardSelect';
import InitialData from './dataProcess/initData';

import DisplayCardsRow from './MergeDiffs';
import { isVisible } from '@testing-library/user-event/dist/utils';

// Create the context within this component
const ModeContext = createContext();

const ModePanel = () => {
  const [currentMode, setCurrentMode] = useState("GenerateContentSelect");
  const [loading, setLoading] = useState(false);  // Track loading state
  const [cancelled, setCancelled] = useState(false);  // Track cancel state

  const [isVisible2, setIsVisible2] = useState(true);

  const [generated_data, set_generated_data] = useState(InitialData)

  const cancelRequest2 = () => {
    setIsVisible2(false); // Hide the modal when the "Close" button is clicked or Esc is pressed
  };

  const generateMilestone = async (draft, flag) => {
    setLoading(true);  // Start loading
    setCancelled(false); // Reset the cancel state

    try {
      const response = await fetch('http://127.0.0.1:5000/process-inputs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input1: draft,  // Send the draft as input1
          input2: flag,   // Send the flag as input2
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log('Backend result:', result);

      if (!cancelled) {
        // Handle result only if not cancelled
        set_generated_data(result)
        setCurrentMode('DealGenerated');
        setIsVisible2(true)


      }
    } catch (error) {
      console.error('Error during backend call:', error);
    } finally {
      setLoading(false); // Stop loading spinner after completion
    }
  };

  const cancelRequest = () => {
    setCancelled(true);  // Mark the request as cancelled
    setLoading(false);   // Stop the loading spinner
    setCurrentMode("GenerateContentSelect"); // Reset the mode or update based on cancellation logic
  };

  const closePanel = () => {
    setCurrentMode("GenerateContentSelect");
  }

  const renderContent = () => {
    return <GenerateContentSelect confirmGenerate={generateMilestone}></GenerateContentSelect>;
  };

  return (
    <ModeContext.Provider value={{ currentMode, setCurrentMode }}>
      <div>
        {loading && (
          <Modal
            visible={loading}
            footer={null}
            closable={false}
            keyboard={true}
            centered
          >
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" />
              <p>Generating...</p>
              <Button onClick={cancelRequest} color="danger" variant="solid">
                Cancel Request
              </Button>
            </div>
          </Modal>
        )}

{currentMode === "DealGenerated" && (
          <Modal
          visible={isVisible2}
          footer={null}
          closable={false}
          centered
          keyboard={true}
          style={{ padding: '40px' }} 
          width={"90%"} // Set a wider width to allow more space for the cards
          onCancel={cancelRequest2}
        >
          <DisplayCardsRow generated_data={generated_data} />
          <div style={{ textAlign: 'center' }}>
              {/* <p>Generating...</p> */}
              <Button style={{marginTop: 20}}  onClick={closePanel} color="danger" variant="solid">
                Close
              </Button>
            </div>
        </Modal>
        )}
        {renderContent()}
      </div>
    </ModeContext.Provider>
  );
};

export default ModePanel;
