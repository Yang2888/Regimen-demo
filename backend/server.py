from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from utils_general import LLMApi
import csv
import io
from get_regimen_from_csv import getJsonFromCsv

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

def get_res_from_input_regimen(regimen_desc, regimen_name):

    prompt = f"""
    You are an expert in extracting structured data from natural language. I will provide you with a cancer regimen description, and you will output a CSV with the following columns:

    - component
    - component_cui
    - cycle_length_ub
    - cycle_length_unit
    - timing_sequence
    - component
    - route
    - allDays
    - variant_cui
    - phase
    - doseMaxNum
    - doseUnit

    ### Rules:
    1. Parse the regimen data and extract the required fields.
    2. Each row in the CSV corresponds to one unique drug administration or route of administration in the regimen.
    3. Include relevant details like timing, cycle length, and routes explicitly.
    4. Use consistent formats for the output.

    ### Example Input:
    Regimen: 
    Carboplatin and Etoposide Induction Regimen:
    - Carboplatin (CUI: 88) administered intravenously (IV) on days 1 of a 21-day cycle, and for the 6 cycles it is always used on days 1.
    - Etoposide (CUI: 201) administered intravenously (IV) on days 1 and 2, and orally (PO) on day 3 in the same cycle. This is part of the induction phase with variant CUI 130283. As it is also used in all 6 cycles, so the timing_sequence is "1,2,3,4,5,6".

    ### Example Output:
    component,component_cui,cycle_length_ub,cycle_length_unit,timing_sequence,component,route,allDays,variant_cui,phase,doseMaxNum,doseUnit
    Carboplatin,88,21,day,"1,2,3,4,5,6",Carboplatin,IV,1,130283,Induction,5,AUC
    Etoposide,201,21,day,"1,2,3,4,5,6",Etoposide,IV,"1,2",130283,Induction,120,mg/m^2
    Etoposide,201,21,day,"1,2,3,4,5,6",Etoposide,PO,3,130283,Induction,100,mg




    ### Now Your Input:
    Regimen: 
    {regimen_desc}

    Provide the output in the CSV format described.

    NOTE: timing_sequence is fucking cycle index and allDays is the days the drug is used during the cycle!!!!!! If a drug is used in cycle 1,2,3 and in every cycle it is used in day 1, then timing_sequence is "1,2,3" and alldays is "1". By default, if not pointed out, then a drug is used in every cycle.

    NOTE: For the timing_sequence, you should examine which cycles the dose is used, for example, if it is used in cycle 1,2,3, then the answer should just be "1,2,3", without triple quotes or shit like that. Normally, the ones used in every cycle will not be pointed out for specification, for such cases, you need to write every cycle into the sequence. For example, if there are 8 cycles in all and one drug is used every cycle, then its timing_sequence should be "1,2,3,4,5,6,7,8".

    NOTE: You should make sure the drug used in most cycles be the first row of the csv file.

    NOTE: DO NOT GIVE ANY EXTRA EXPLANATION! JUST THE CSV DATA AND NO EXTEA INFO! NO NEED FOR STARTING TEXT LIKE "CSV FILE CONTENT:" or EXTRA SINGS LIKE "```". YOU MUST DIRECTLY GIVE ME ONLY THE DATA INSIDE THE CSV FILE 

    """

    # print(prompt)

    csv_output = LLMApi(prompt)

    # print(csv_output)

    return csv_output, regimen_name


def save_csv(csv_text, file_name):
    """
    Function to save the LLM output as a CSV file, correctly handling quoted values and special characters.
    """
    # Use the csv.reader to correctly parse the text
    csv_reader = csv.reader(io.StringIO(csv_text.strip()))
    
    # Extract rows from the reader
    rows = list(csv_reader)
    
    # Write to a CSV file
    with open(file_name, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerows(rows)

def regimen_to_csv(regimen_desc, regimen_name):
    llm_reg, name = get_res_from_input_regimen(regimen_desc, regimen_name)
    save_csv(llm_reg, "generated_regimen.csv")

    with open("regimen_name.txt", "w") as file:
        file.write(name)

@app.route('/trail', methods=['OPTIONS', 'GET'])
def trail():
    if request.method == 'OPTIONS':
        # Handle the preflight request
        response = app.make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        return response, 200

    # Handle the actual GET request
    return jsonify({"111": 222})

@app.route('/process-inputs', methods=['POST'])
def process_inputs():
    try:
        data = request.get_json()
        input1 = data.get('input1')
        input2 = data.get('input2')

        if not input1:
            return jsonify({"error": "Missing required input: input1"}), 400

        # Call function to process input and generate CSV
        regimen_to_csv(input1, input2)

        ans =  getJsonFromCsv()
        
        print(ans)

        return ans

    except Exception as e:
        # Log the error (for production, log this properly)
        print(f"error: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/')
def home():
    return "Hello, World!"

def start_backend(host='0.0.0.0', port=3113, debug=True):
    """
    Function to start the backend server.
    :param host: The host on which the server should run (default is localhost).
    :param port: The port on which the server should listen (default is 5000).
    :param debug: Whether to run the server in debug mode (default is True).
    """
    app.run(host=host, port=port, debug=debug)

if __name__ == "__main__":
    start_backend()
