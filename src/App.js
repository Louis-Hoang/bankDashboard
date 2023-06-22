import React, { useState, useEffect } from 'react';
import FormComponent from './components/FormComponent.js';
import PlotComponent from './components/PlotComponent.js';
import './App.css';

function App() {
  // const [data, setData] = useState({});

  // useEffect(() => {
  //   fetch('/api').then(
  //     response => response.json()
  //   ).then(
  //     data => {
  //       setData (data)
  //       console.log(data)
  //     }
  //   )
  // }, []);

  // const addDataHandler = data => {
  //   console.log('In app.js');
  //   console.log(data)
  //   const bankInfo = data;
  // }

  const [returnData, setReturnData] = useState(null);
  return (
    <div className = "wrapper">
      <h1>Banking Dashboard</h1>
      <FormComponent setReturnData={setReturnData} />
      <PlotComponent returnData ={returnData} />
      
    </div>
  );
  
}

export default App;
