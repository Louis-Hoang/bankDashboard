import React, { useState, useEffect } from "react";
import "../assets/FormComponent.css";
import Select, { createFilter } from "react-select";
import MenuList from "./MenuList";

const FormComponent = ({ setReturnData, setLoading }) => {
    const [bankData, setBankData] = useState(null);

    function abbrState(input, to) {
        var states = [
            ["Arizona", "AZ"],
            ["Alabama", "AL"],
            ["Alaska", "AK"],
            ["Arkansas", "AR"],
            ["California", "CA"],
            ["Colorado", "CO"],
            ["Connecticut", "CT"],
            ["Delaware", "DE"],
            ["Florida", "FL"],
            ["Georgia", "GA"],
            ["Hawaii", "HI"],
            ["Idaho", "ID"],
            ["Illinois", "IL"],
            ["Indiana", "IN"],
            ["Iowa", "IA"],
            ["Kansas", "KS"],
            ["Kentucky", "KY"],
            ["Louisiana", "LA"],
            ["Maine", "ME"],
            ["Maryland", "MD"],
            ["Massachusetts", "MA"],
            ["Michigan", "MI"],
            ["Minnesota", "MN"],
            ["Mississippi", "MS"],
            ["Missouri", "MO"],
            ["Montana", "MT"],
            ["Nebraska", "NE"],
            ["Nevada", "NV"],
            ["New Hampshire", "NH"],
            ["New Jersey", "NJ"],
            ["New Mexico", "NM"],
            ["New York", "NY"],
            ["North Carolina", "NC"],
            ["North Dakota", "ND"],
            ["Ohio", "OH"],
            ["Oklahoma", "OK"],
            ["Oregon", "OR"],
            ["Pennsylvania", "PA"],
            ["Rhode Island", "RI"],
            ["South Carolina", "SC"],
            ["South Dakota", "SD"],
            ["Tennessee", "TN"],
            ["Texas", "TX"],
            ["Utah", "UT"],
            ["Vermont", "VT"],
            ["Virginia", "VA"],
            ["Washington", "WA"],
            ["West Virginia", "WV"],
            ["Wisconsin", "WI"],
            ["Wyoming", "WY"],
        ];

        if (to === "abbr") {
            input = input.replace(/\w\S*/g, function (txt) {
                return (
                    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                );
            });
            for (var i = 0; i < states.length; i++) {
                if (states[i][0] === input) {
                    return states[i][1];
                }
            }
        } else if (to === "name") {
            input = input.toUpperCase();
            for (i = 0; i < states.length; i++) {
                if (states[i][1] === input) {
                    return states[i][0];
                }
            }
        }
    }

    useEffect(() => {
        const fetchBankData = async () => {
            try {
                console.log("first");
                const response = await fetch(
                    "https://banks.data.fdic.gov/api/institutions?filters=ACTIVE%3A1&fields=STNAME%2CNAME&limit=10000&format=json&download=false&filename=data_file"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch bank data");
                }

                const bankData = await response.json();

                // Extract the relevant data from the response
                const data = bankData.data;

                const transformedData = data.map((item) => {
                    var { NAME, STNAME } = item["data"];
                    var fullState = STNAME;
                    STNAME = abbrState(STNAME, "abbr");
                    const label = STNAME ? `${NAME} (${STNAME})` : NAME;
                    return {
                        value: [NAME, fullState],
                        label: label,
                        state: STNAME,
                    };
                });
                // Set the transformed data in the suggestions state
                setBankData(transformedData);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchBankData();
    }, []);

    const metricOptions = [
        { value: "ASSET", label: "Asset" },
        { value: "DEP", label: "Deposit" },
        { value: "ROE", label: "Return on equity" },
        // { value: 'NIMY', label: 'Net interest margin' },
        // { value: 'NTLNLS', label: 'Total net charge-off' },
        { value: "EEFFR", label: "Efficency ratio" },
        { value: "NTLNLSCOR", label: "Total net charge-off ratio" },
    ];

    const [formData, setFormData] = useState({
        bank: "",
        metric: "",
        year: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target || event;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.bank && formData.metric && formData.year) {
            try {
                setLoading(true);
                const url = "https://bankdashboard.onrender.com";
                const response = await fetch(url + "/submitForm", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                // Handle the response as needed
                const data = await response.json();
                setReturnData(data);
                setLoading(false);
                // props.onAddData(data)
                // Clear the form inputs and reset the state
                setFormData({
                    bank: formData.bank,
                    metric: formData.metric,
                    year: "",
                });
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            alert("Please enter all field");
        }
    };

    return (
        <div>
            {bankData ? (
                <form onSubmit={handleSubmit} className="bankForm">
                    <div className="inputBox">
                        <label htmlFor="Bank" className="inputLabel">
                            Bank:
                        </label>
                        <div style={{ width: "300px" }}>
                            <Select
                                id="bank"
                                name="bank"
                                components={{ MenuList }}
                                options={bankData}
                                defaultValue={formData.bank}
                                filterOption={createFilter({
                                    ignoreAccents: false,
                                })}
                                onChange={(selectedOption) =>
                                    handleChange({
                                        name: "bank",
                                        value: selectedOption.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="inputBox">
                        <label htmlFor="Metrics" className="inputLabel">
                            Metric:
                        </label>
                        <div style={{ width: "210px" }}>
                            <Select
                                id="metric"
                                name="metric"
                                options={metricOptions}
                                defaultValue={formData.metric}
                                onChange={(selectedOption) =>
                                    handleChange({
                                        name: "metric",
                                        value: selectedOption.value,
                                    })
                                }
                                style={{ width: "82%" }}
                                autosize={false}
                            />
                        </div>
                    </div>

                    <div className="inputBox">
                        <label htmlFor="Year" className="inputLabel">
                            Year:
                        </label>
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
