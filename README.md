## Backend - Flask
### Installation
                    
### 1 .Clone the git repo and create an environment 
          
Our goal now is to make a virtual environment to avoid conflicting with our machine's primary dependencies
          
**Windows**
          
```bash
git clone https://github.com/Louis-Hoang/bankDashboard.git
cd bankDashboard/api
py -3 -m venv venv
```
          
**macOS/Linux**
          
```bash
git clone https://github.com/Louis-Hoang/bankDashboard.git
cd bankDashboard/api
python3 -m venv venv
```

### 2 .Activate the environment
          
**Windows** 

```venv\Scripts\activate```
          
**macOS/Linux**

```. venv/bin/activate```
or
```source venv/bin/activate```

### 3 .Install the requirements

Applies for windows/macOS/Linux

```pip install -r requirements.txt```

### 5. Run the application 

**For linux and macOS**
Make the run file executable by running the code

```python app.py```

Then start the application by executing the run file

```yarn start-api```

**On windows**
```
set FLASK_APP=app
flask run
```
OR 
`python app.py`

## Frontend - React
### Installation

We just need to install the packages listed on package.json.

From api folder
```
cd ..
npm install
```

`npm start`

## Updating pip packages

In an active virtual environment install updates using the command:

`pip list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1  | xargs -n1 pip install -U`

Update the reqirements.txt file.

`pip freeze > requirements.txt`
