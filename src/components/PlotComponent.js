// import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import '../assets/PlotComponent.css';


const PlotComponent = ({ returnData }) => {
  
  // const [plotData, setPlotData] = useState(null);
  
  if (returnData && typeof returnData['data'][0] == 'string') {
    // console.log(returnData)
    return (
      <div className = "wrapper">
        <Plot
          data={[
              {
                x: returnData['year'],
                y: returnData['data'],
                type: 'scatter'
              }
            ]}
          layout={{ margin: { l: 140 }, width: 720, height: 440, title: `${returnData['bank']} ${returnData['metricName']} Graph` , yaxis : {tickformat: '$,'}} }
        />
      </div>
    );
  }
  else if (returnData) {
    
    return (
      <div className = "wrapper">
        <Plot
          data={[
              {
                x: returnData['year'],
                y: returnData['data'],
                type: 'scatter'
              }
            ]}
          layout={ {width: 620, height: 440, title: `${returnData['bank']} ${returnData['metricName']} Graphs`, yaxis: {tickformat:','}} }
        />
      </div>
    );
  }
  
};

export default PlotComponent;