// import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import '../assets/PlotComponent.css';


const PlotComponent = ({ returnData }) => {
  function linearRegression(x,y){
        var lr = {};
        var n = y.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;

        for (var i = 0; i < y.length; i++) {

            sum_x += x[i];
            sum_y += y[i];
            sum_xy += (x[i]*y[i]);
            sum_xx += (x[i]*x[i]);
            sum_yy += (y[i]*y[i]);
        } 

        lr['sl'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
        lr['off'] = (sum_y - lr.sl * sum_x)/n;
        lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

        return lr;
  }
  
  function trendLine(returnData) {
  var x_data_64 = returnData['year'];
  var y_data_64 = returnData['data'];
  var lr = linearRegression(x_data_64, y_data_64);
  //console.log(lr);

  var trace = {x: x_data_64,
              y: y_data_64,
              name: "Scatter"
              };  
  //console.log(trace);

  var fit_from = Math.min(...y_data_64)
  var fit_to = Math.max(...y_data_64)

  var fit = {
    x: [fit_from, fit_to],
    y: [fit_from*lr.sl+lr.off, fit_to*lr.sl+lr.off],
    mode: 'lines',
    type: 'scatter',
    name: "R2=".concat((Math.round(lr.r2 * 10000) / 10000).toString())
  };
  
    var trend = trace
    console.log(fit)
    return trend
  }
 
  if (returnData) {
    var linePlot = trendLine(returnData);
  }

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
      // <div className = "wrapper">
      //   <Plot
      //     data={[
      //         {
      //           x: returnData['year'],
      //           y: returnData['data'],
      //           type: 'scatter'
      //         }
      //       ]}
      //     layout={ {width: 620, height: 440, title: `${returnData['bank']} ${returnData['metricName']} Graphs`, yaxis: {tickformat:','}} }
      //   />
      // </div>
      <div>
        <Plot
          data={[
              {
                x: returnData['year'],
                y: returnData['data'],
                type: 'bar'
              },
              linePlot
            ]}
          layout={{ margin: { l: 140 }, width: 720, height: 440, title: `${returnData['bank']} ${returnData['metricName']} Graph` , yaxis : {tickformat: ','}} }
        />
      </div>
    );
  }
  
};

export default PlotComponent;