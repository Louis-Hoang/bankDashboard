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
    console.log(returnData);
  }

  if (loading) {
    return (
      <div className="loadingContainer">
        <div className="loadingSpinner"></div>
        <div className="loadingText">Loading...</div>
      </div>
    );  
  }
  else if (returnData) {
    return (
      <div className="wrapper_inner">
        <div className="plot_1">
          <Plot
            data={[
                {
                  x: returnData['year'],
                  y: returnData['data'],
                  type: 'scatter',
                  name: "Raw Data"
                },
              {
                x: returnData['year'],
                // y: returnData['data'],
                y: returnData[`${[returnData['metricName'].toLowerCase()]}_rm`],
                type: 'scatter',
                name: "Rolling Mean"
                }
              ,
              ]}
            layout={{ margin: { l: 100 }, width: 620, height: 440, title: `${returnData['bank']}, ${stateName}, ${returnData['metricName']} Graph`, yaxis: { tickformat:typeof returnData['data'][0] == 'string' ? ('$,') : (',') }} }
          />
          <Plot
            data={[
                {
                  x: returnData['year'],
                  y: returnData['n_interest_margin'],
                  type: 'scatter',
                  name: "Raw data"
              },
              {
                  x: returnData['year'],
                  y: returnData['n_interest_margin_rm'],
                  type: 'scatter',
                  name: "Rolling Mean"
                }
              ]}
            layout={{ margin: { l: 100 }, width: 620, height: 440, title: `${returnData['bank']}, ${stateName}, Net Interest Margin Graph` , yaxis : {tickformat: ','}} }
          />
          <Plot
            data={[
                {
                  x: returnData['year'],
                  y: returnData['roa'],
                  type: 'scatter',
                  name: "Raw data"
                },
                {
                  x: returnData['year'],
                  y: returnData['roa_rm'],
                  type: 'scatter',
                  name: "Rolling Mean"
                }
              ]}
            layout={{ margin: { l: 100 }, width: 620, height: 440, title: `${returnData['bank']}, ${stateName}, ROA Graph` , yaxis : {tickformat: ','}} }
          />
          <Plot
            data={[
                {
                  x: returnData['year'],
                  y: returnData['charge_off'],
                  type: 'scatter',
                  name: "Raw data"
                },
                {
                  x: returnData['year'],
                  y: returnData['charge_off_rm'],
                  type: 'scatter',
                  name: "Rolling Mean"
                },
              ]}
            layout={{ margin: { l: 100 }, width: 620, height: 440, title: `${returnData['bank']}, ${stateName}, Net Charge-Offs Graph` , yaxis : {tickformat: ','}} }
          />
        </div>
        <div className="bal_sheet">
          <h2>Balance Sheet</h2>
          <div className="main_item">
            <span>Total Assets</span>
            <span>{asset}</span>
          </div>
          <div className="bal_sheet_item">
            <span>Cash from Deposit</span>
            <span>{cash_dep}</span>
          </div>
          <div className="bal_sheet_item">
            <span>Securities</span>
            <span>{securities}</span>
          </div>
          <div className="bal_sheet_item">
            <span>Net Loan & Leases</span>
            <span>{net_lnls}</span>
          </div>
          <div className="bal_sheet_item">
            <span>Other Assets</span>
            <span>{other_asset}</span>
          </div>
          <div className= "main_item">
            <span>Liabilities & Capital</span>
            <span>{lib_cap}</span>
          </div>
          <div className="bal_sheet_item">
            <span>Liabilities</span>
            <span>{liab}</span>
          </div>
          <div className="bal_sheet_item">
            <span>Equity</span>
            <span>{eq}</span>
          </div>
        </div>
      </div>
    );
  }

  
};

export default PlotComponent;