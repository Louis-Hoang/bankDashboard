import re
from flask import Flask, request
import numpy as np
import matplotlib
import requests
import json
import pandas as pd
import urllib.parse

app = Flask(__name__)

#Get Cert ID from bank name
def getCert(bankName,state): #add more parameter beside bank name, financial metric, which quarters, etc.
    encode = urllib.parse.quote(bankName)
    link = "https://banks.data.fdic.gov/api/institutions?filters=ACTIVE%3A1%20AND%20STNAME%3A{}&search=NAME%3A%20{}&fields=ZIP%2COFFDOM%2CCITY%2CCOUNTY%2CSTNAME%2CSTALP%2CNAME%2CACTIVE%2CCERT%2CCBSA%2CASSET%2CNETINC%2CDEP%2CDEPDOM%2CROE%2CROA%2CDATEUPDT%2COFFICES&sort_by=OFFICES&sort_order=DESC&limit=10&offset=0&format=json&download=false&filename=data_file".format(state,encode)
    response = requests.get(link)
    res = response.json()['data']
    df = [res[i]['data']for i in range(len(res))]
    return (df[0]['NAME'], df[0]['CERT'])

#Get a panda df from bank name and certain year 
def res(bankName,state,year):
    certNum = getCert(bankName,state)[1] #get Cert number
    fullBankName = getCert(bankName,state)[0] #get full bank name 
    try:
        if(int(year)): #single year
            link = "https://banks.data.fdic.gov/api/financials?filters=CERT%3A{}%20AND%20REPYEAR%3A%20{}&fields=CERT%2CREPDTE%2CSTNAME%2CASSET%2CDEP%2CROA%2CROE%2CNIMY%2CEEFFR%2CNTLNLS%2CNTLNLSCOR&limit=100&offset=0&agg_limit=100&format=json&download=false&filename=data_file".format(certNum, year)
    except: #a time range
        temp = [int(x.group()) for x in re.finditer(r'\d+', year)]
        start, end  = temp[0], temp[1]
        link = "https://banks.data.fdic.gov/api/financials?filters=CERT%3A{}%20AND%20REPYEAR%3A%20%5B{}%20TO%20{}%5D&fields=CERT%2CREPDTE%2CSTNAME%2CASSET%2CDEP%2CROA%2CROE%2CNIMY%2CEEFFR%2CNTLNLS%2CNTLNLSCOR&limit=100&offset=0&agg_limit=100&format=json&download=false&filename=data_file".format(certNum, start, end)
    response = requests.get(link)
    response = requests.get(link)
    res = response.json()['data']
    df = [res[i]['data']for i in range(len(res))]
    df = pd.DataFrame(df)[['CERT','REPDTE', 'ASSET', 'STNAME', 'DEP', 'ROA','ROE','NIMY','EEFFR','NTLNLS','NTLNLSCOR']]
    df.insert(0, "Bank", [fullBankName]*len(df), True)

    ##Data formatting
    df = df.round({'ROA': 2, 'NIMY': 2,'EEFFR':2, 'NTLNLSCOR':2 })
    df['REPDTE']= pd.to_datetime(df['REPDTE'])
    df['REPDTE'] = df['REPDTE'].dt.strftime('%Y-%m-%d')
    df["ASSET"] ='$'+ df["ASSET"].map('{:,.0f}'.format)
    df["DEP"] ='$'+ df["DEP"].map('{:,.0f}'.format)
    df.rename(columns = {'REPDTE':'DATE'}, inplace = True)
    df2 = df.to_dict(orient = 'records')
    new_dict = {item['DATE']:item for item in df2}
    return new_dict, fullBankName





@app.route('/submit-form', methods=['POST'])
def submit_form():
    # Access individual form fields by name
    form_data = request.get_json()
    # Access individual form fields by name, these are string
    bank = form_data.get('bank')[0]
    state = form_data.get('bank')[1]
    print(state)
    metric = form_data.get('metric')
    metric = metric.upper()
    year = form_data.get('year')

    temp, fullBankName = res(bank, state, year)

    returnJson = {'bank': fullBankName, 'metricName':metric, 'state': list(temp.values())[0]['STNAME'], 'year':[i for i in temp], 'data':[temp[i]["{}".format(metric)] for i in temp]}

    return returnJson

    return 'Form data received and processed'

if __name__ == "__main__":
    app.run(debug=True)
