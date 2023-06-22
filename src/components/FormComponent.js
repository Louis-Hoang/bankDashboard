import React, { useState, useEffect } from 'react';
import '../assets/FormComponent.css';
import Select,{ createFilter } from 'react-select'
import MenuList from './MenuList';


const FormComponent = ({ setReturnData }) => {
  const [bankData, setBankData] = useState(null);
  
  
  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const response = await fetch(
          'https://banks.data.fdic.gov/api/institutions?filters=ACTIVE%3A1&fields=CITY%2CNAME&limit=10000&format=json&download=false&filename=data_file'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch bank data');
        }

        const bankData = await response.json();

        // Extract the relevant data from the response
        const data = bankData.data;

        // Transform the data into the desired format
        const transformedData = data.map((item) => ({
          value: item['data']['NAME'],
          label: item['data']['NAME'],
        }));

        // Set the transformed data in the suggestions state
        setBankData(transformedData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchBankData();
  }, []);

  
  const metricOptions = [
    { value: 'ASSET', label: 'Asset' },
    { value: 'DEP', label: 'Deposit' },
    { value: 'ROA', label: 'Return on assets' },
    { value: 'ROE', label: 'Return on equity' },
    { value: 'NIMY', label: 'Net interest margin' },
    { value: 'EEFFR', label: 'Efficency ratio' },
    { value: 'NTLNLS', label: 'Total net charge-off' },
    { value: 'NTLNLSCOR', label: 'Total net charge-off ratio' }
  ]
  
  const [formData, setFormData] = useState({
    bank: '',
    metric: '',
    year: ''
  });

  // const [returnData, setReturnData] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target || event;
  
    setFormData({
      ...formData,
      [name]: value
    });
  };

 
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.bank && formData.metric && formData.year) {
      try {
        const response = await fetch('/submit-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        // Handle the response as needed
        const data = await response.json();
        setReturnData(data);
      
        // props.onAddData(data)
        // Clear the form inputs and reset the state
        setFormData({
          bank: formData.bank,
          metric: formData.metric,
          year: ''
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
    else {
      alert("Please enter all field")
    }
  };
  

  // if (!bankData) {
  //   return <div>Loading...</div>
  // }

  return (
    <div >
      {bankData ? (
        <form onSubmit={handleSubmit} className="bankForm">
          <div className="inputBox">
            <label htmlFor="Bank" className="inputLabel">Bank:</label>
            <div style={{width: '300px'}}>
              <Select
                id='bank'
                name="bank"
                components={{ MenuList }}
                options={bankData}
                defaultValue={formData.bank}
                filterOption={createFilter({ ignoreAccents: false })}
                onChange={(selectedOption) => handleChange({ name: 'bank', value: selectedOption.value })}
                />
            </div>
          </div>  
          
          <div className="inputBox">
            <label htmlFor="Metrics" className="inputLabel">Metric:</label>
            <div style={{width: '210px'}}>
              <Select
                id='metric'
                name="metric"
                options={metricOptions}
                defaultValue={formData.metric}
                onChange={(selectedOption) => handleChange({ name: 'metric', value: selectedOption.value })}
                style={{ width: '82%' }}
                autosize = {false}
                />
            </div>
          </div>  
          
          <div className = 'inputBox'>
                <label htmlFor="Year" className="inputLabel">Year:</label>
                <input
                type="text"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                />
          </div>
          <button type="submit">Submit</button>
          </form>
         ) : (
        <div className="loadingContainer">
          <div className="loadingSpinner"></div>
          <div className="loadingText">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default FormComponent;
