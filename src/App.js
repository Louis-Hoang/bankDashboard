import React, { useState, useEffect } from 'react';
import FormComponent from './components/FormComponent.js';
import PlotComponent from './components/PlotComponent.js';
import './App.css';

function App() {
  
  const [returnData, setReturnData] = useState(null);
  const [loading, setLoading] = useState(null);
  return (
    <div className = "wrapper">
      <h1>Banking Dashboard</h1>
      <FormComponent setReturnData={setReturnData} setLoading={setLoading} />
      <PlotComponent returnData={returnData} loading={loading} />
      
    </div>
  );
  
}

export default App;
