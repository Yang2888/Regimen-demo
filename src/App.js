// app.js
import React from 'react';
import OrgChartTree from './components/OrgChartTree'; // Adjust the path as necessary

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Organizational Chart</h1>
      <OrgChartTree width="1000px" height="800px" />
    </div>
  );
}

export default App;
