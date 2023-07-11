import React, { useState, useEffect } from 'react';
import FormComponent from './components/FormComponent.js';
import PlotComponent from './components/PlotComponent.js';
import './App.css';

function App() {
  
  const [returnData, setReturnData] = useState(null);
  if (returnData){
    console.log(returnData)
  }
  return (
    <div className = "wrapper">
      <h1>Banking Dashboard</h1>
      <FormComponent setReturnData={setReturnData} />
      <PlotComponent returnData ={returnData} />
      
    </div>
  );
  
}

export default App;
