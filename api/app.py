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
def res(bankName,state,year,metric):
    certNum = getCert(bankName,state)[1] #get Cert number
    fullBankName = getCert(bankName,state)[0] #get full bank name 
    try:
        if(int(year)): #single year
            link = "https://banks.data.fdic.gov/api/financials?filters=CERT%3A{}%20AND%20REPYEAR%3A%20{}&fields=CERT%2CCHBAL%2CSC%2CLNLSNET%2CLIABEQ%2CLIAB%2CEQ%2CDRLNLSR%2CREPDTE%2CSTNAME%2CASSET%2CDEP%2CROA%2CROE%2CNIMY%2CEEFFR%2CNTLNLS%2CNTLNLSCOR&limit=100&offset=0&agg_limit=100&format=json&download=false&filename=data_file".format(certNum, year)
    except: #a time range
        temp = [int(x.group()) for x in re.finditer(r'\d+', year)]
        start, end  = temp[0], temp[1]
        link = "https://banks.data.fdic.gov/api/financials?filters=CERT%3A{}%20AND%20REPYEAR%3A%20%5B{}%20TO%20{}%5D&fields=CERT%2CCHBAL%2CLNLSNET%2CSC%2CLIABEQ%2CLIAB%2CEQ%2CDRLNLSR%2CREPDTE%2CSTNAME%2CASSET%2CDEP%2CROA%2CROE%2CNIMY%2CEEFFR%2CNTLNLS%2CNTLNLSCOR&limit=100&offset=0&agg_limit=100&format=json&download=false&filename=data_file".format(certNum, start, end)
    response = requests.get(link)
    response = requests.get(link)
    res = response.json()['data']   
    df = [res[i]['data']for i in range(len(res))]
    df = pd.DataFrame(df)[['CERT','REPDTE','STNAME','DEP', 'ROA','ROE','NIMY','EEFFR','NTLNLS','NTLNLSCOR','DRLNLSR','ASSET','CHBAL','SC','LNLSNET','LIABEQ','LIAB','EQ']]
    df.insert(0, "Bank", [fullBankName]*len(df), True)
    df.insert(16,'OTASSET', 0, True)

    for var in ["ASSET", "DEP", "ROA", "NIMY", "NTLNLS", metric]:
        newVar = "{}_RM".format(var)
        df[newVar] = df[var].rolling(4).mean()
        if var not in ["ASSET", "DEP"]:
            df[newVar] = df[newVar].fillna("")

    ##Data formatting
    df = df.round({'ROA': 2, 'ROA RM':2, 'NIMY': 2,'EEFFR':2, 'NTLNLSCOR':2, 'DRLNLSR':2 })
    df['REPDTE']= pd.to_datetime(df['REPDTE'])
    df['REPDTE'] = df['REPDTE'].dt.strftime('%Y-%m-%d')
    df['OTASSET'] = df['ASSET']-df['CHBAL']-df['SC']-df['LNLSNET']
    for name in ['DEP', 'DEP_RM', 'ASSET','ASSET_RM','CHBAL','SC','LNLSNET','OTASSET','LIABEQ','LIAB','EQ']:
        df[name] ='$'+ df[name].map('{:,.0f}'.format)
    
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
    metric = form_data.get('metric')
    metric = metric.upper()
    year = form_data.get('year')

    temp, fullBankName = res(bank, state, year, metric)

    defaultDict = { 'asset': [temp[i]['ASSET'] for i in temp] ,'n_interest_margin': [temp[i]['NIMY'] for i in temp], 'n_interest_margin_rm': [temp[i]['NIMY_RM'] for i in temp], 'cash_from_dep': [temp[i]['CHBAL'] for i in temp], 'sec': [temp[i]['SC'] for i in temp],'net_ln&ls':[temp[i]['LNLSNET'] for i in temp],
               'ot_asset':[temp[i]['OTASSET'] for i in temp], 'liab&capt': [temp[i]['LIABEQ'] for i in temp], 'liab': [temp[i]['LIAB'] for i in temp], 'equity': [temp[i]['EQ'] for i in temp],
               'roa': [temp[i]['ROA'] for i in temp], 'roa_rm': [temp[i]['ROA_RM'] for i in temp], 'ln&ls_ratio': [temp[i]['DRLNLSR'] for i in temp], 'charge_off':[temp[i]['NTLNLS'] for i in temp],'charge_off_rm':[temp[i]['NTLNLS_RM'] for i in temp],
               '{}_rm'.format(metric.lower()) : [temp[i]['{}_RM'.format(metric)] for i in temp]}

    returnJson = {'bank': fullBankName, 'metricName':metric, 'state': list(temp.values())[0]['STNAME'], 'year':[i for i in temp], 'data':[temp[i]["{}".format(metric)] for i in temp]}
    returnJson.update(defaultDict)
   

    return returnJson

    return 'Form data received and processed'

if __name__ == "__main__":
    app.run(debug=True)
