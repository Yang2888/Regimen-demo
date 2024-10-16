import React, { useState, useContext, createContext } from 'react';
import { Button, Card } from 'antd';
import GenerateContentSelect from './GenerateModeCardSelect';

// Create the context within this component
const ModeContext = createContext();

const ModePanel = () => {
  const [currentMode, setCurrentMode] = useState("GenerateContentSelect");

  const generateMilestone = (draft, flag) => {
    console.log(draft)
    console.log(flag)
  }

  const renderContent = () => {
    switch (currentMode) {
      case "GenerateContentSelect":
        return <GenerateContentSelect confirmGenerate = {generateMilestone}></GenerateContentSelect>;
      case "Generating":
        return <Card>Generating...</Card>;
      case "DealGenerated":
        return <Card>Deal Generated Successfully!</Card>;
      default:
        return null;
    }
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
        {/* <div style={{ marginBottom: '16px' }}>
          <Button type="primary" onClick={() => setCurrentMode("GenerateContentSelect")} style={{ marginRight: '8px' }}>
            Generate Content
          </Button>
          <Button type="default" onClick={() => setCurrentMode("Generating")} style={{ marginRight: '8px' }}>
            Generating
          </Button>
          <Button type="default" onClick={() => setCurrentMode("DealGenerated")}>
            Deal Generated
          </Button>
        </div> */}
        <div>
          {renderContent()}
        </div>
    </ModeContext.Provider>
  );
};

export default ModePanel;
