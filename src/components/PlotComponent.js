// import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import '../assets/PlotComponent.css';


const PlotComponent = ({ returnData, loading }) => {
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
    // console.log(returnData)
    var stateName = returnData['state'][0] + (returnData['state'].slice(1)).toLowerCase();
    
    var asset = returnData['asset'].slice(-1);
    var cash_dep = returnData['cash_from_dep'].slice(-1);
    var securities = returnData['sec'].slice(-1);
    var net_lnls = returnData['net_ln&ls'].slice(-1);
    var other_asset = returnData['ot_asset'].slice(-1);
    var lib_cap = returnData['liab&capt'].slice(-1);
    var liab = returnData['liab'].slice(-1);
    var eq = returnData['equity'].slice(-1);
  }

  if (loading && !returnData) {
    return (
      <div className="loadingContainer">
        <div className="loadingSpinner"></div>
        <div className="loadingText">Loading...</div>
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
          layout={{ margin: { l: 140 }, width: 620, height: 440, title: `${returnData['bank']}, ${stateName}, ${returnData['metricName']} Graph`, yaxis: { tickformat:typeof returnData['data'][0] == 'string' ? ('$,') : (',') }} }
        />
        <Plot
          data={[
              {
                x: returnData['year'],
                y: returnData['asset'],
                type: 'scatter'
              }
            ]}
          layout={{ margin: { l: 140 }, width: 620, height: 440, title: `${returnData['bank']}, ${stateName}, Asset Graph` , yaxis : {tickformat: '$,'}} }
        />
        <Plot
          data={[
              {
                x: returnData['year'],
                y: returnData['roa'],
                type: 'scatter'
              }
            ]}
          layout={{ margin: { l: 140 }, width: 620, height: 440, title: `${returnData['bank']}, ${stateName}, ROA Graph` , yaxis : {tickformat: ','}} }
        />
        <div className="bal_sheet">
          <p>Total Assets: {asset}</p>
          <p>Cash from Dep: {cash_dep}</p>
          <p>Securities: {securities}</p>
          <p>Net Loan & Leases: {net_lnls}</p>
          <p>Other Assets: {other_asset} </p>
          <p>Liabilities & Capital: {lib_cap}</p>
          <p>Liabilities: {liab}</p>
          <p>Equity: {eq}</p>
        </div>
      </div>
    );
  }

  
};

export default PlotComponent;