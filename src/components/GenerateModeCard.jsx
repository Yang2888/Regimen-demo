import React, { useState, useContext, createContext } from 'react';
import { Button, Card } from 'antd';
import GenerateContentSelect from './GenerateModeCardSelect';

// Create the context within this component
const ModeContext = createContext();

const ModePanel = () => {
  const [currentMode, setCurrentMode] = useState("GenerateContentSelect");

  const generateMilestone = async (draft, flag) => {
    console.log(draft);
    console.log(flag);

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
  
      const result = await response.json();  // Assuming the backend sends raw text
      console.log('Backend result:', result);
  
      // Do something with the result here (e.g., updating state)
    } catch (error) {
      console.error('Error during backend call:', error);
    }
  };
  

  const renderContent = () => {
    return <GenerateContentSelect confirmGenerate = {generateMilestone}></GenerateContentSelect>;
  };

  const changeToGenerating = () => {
    setCurrentMode("Generating");
  };
  
  // Function to change mode to "DealGenerated"
  const changeToDealGenerated = () => {
    setCurrentMode("DealGenerated");
  };

  return (
    <ModeContext.Provider value={{ currentMode, setCurrentMode }}>
        <div>
          {renderContent()}
        </div>
    </ModeContext.Provider>
  );
};

export default ModePanel;
