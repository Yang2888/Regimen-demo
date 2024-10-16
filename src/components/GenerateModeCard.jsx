import React, { useState, useContext, createContext } from 'react';
import { Button, Card, Spin, Modal } from 'antd';
import GenerateContentSelect from './GenerateModeCardSelect';

// Create the context within this component
const ModeContext = createContext();

const ModePanel = () => {
  const [currentMode, setCurrentMode] = useState("GenerateContentSelect");
  const [loading, setLoading] = useState(false);  // Track loading state
  const [cancelled, setCancelled] = useState(false);  // Track cancel state

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
        setCurrentMode('DealGenerated');
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
        {renderContent()}
      </div>
    </ModeContext.Provider>
  );
};

export default ModePanel;
