import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    # Read CSV and add data to a list of dictionaries
    data = []
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            data.append(row)

    # Write list of dictionaries to JSON file
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)

    return data

import re

def parse_formula(formula):
    result = []
    # Regex to match different types of numbers in the format
    pattern = r"\(\+(\d+)\)|\((\d+)\)|\+(\d+)|(\d+)"
    
    for match in re.findall(pattern, formula):
        # Checking which group has a match and assigning the appropriate type
        if match[0]:  # Matches (+num) type
            result.append({"number": int(match[0]), "type": "positive"})
        elif match[1]:  # Matches (num) type
            result.append({"number": int(match[1]), "type": "special"})
        elif match[2]:  # Matches +num type
            result.append({"number": int(match[2]), "type": "positive"})
        elif match[3]:  # Matches num type (normal)
            result.append({"number": int(match[3]), "type": "normal"})
    
    return result
import copy
def transform_blocks(blocks, metadata):
    # Create a deep copy of the blocks to avoid modifying the original structure
    blocks = copy.deepcopy(blocks)
    
    # Link each block to the next block as a child
    for i in range(len(blocks) ):
        if i < len(blocks)-1:
            blocks[i]["children"] = [blocks[i + 1]]
        blocks[i]["Title"] = f"Cycle{i + 1}"
        blocks[i]["Summary"] = f"This is cycle{i + 1} for phase {metadata['phase']}"

    # Return only the first block with nested children
    return blocks[0]

def getjson(csv_file_path = 'filtered_output.csv', json_file_path = 'output.json' ):
# Example usage
  # Replace with your CSV file path
 # Replace with your JSON output path
    data = csv_to_json(csv_file_path, json_file_path)
    # print(data)
    data0 = data[0]
    metadata = {}
    # print(f"start generating metadata... ")
    metadata["cycle_length_ub"] = data0["cycle_length_ub"]
    metadata["cycle_length_unit"] = data0["cycle_length_unit"]
    metadata["drug_len"] = len(data)
    metadata["phase"] = data0["phase"]

    # print(f"metadat st1 : {metadata}")

    

    blocks = parse_formula(data[0]["timing_sequence"])

    for block in blocks:
        block["drugs"] = []


    # for every block, it contains drug infos
    # print(blocks)
    for row_info in data:
        times = parse_formula(row_info["timing_sequence"])
        # print(f"times: {times}")
        # print(f"row_info: {row_info}")
        for time in times:
            # print(time['number'] - 1)
            blocks[time['number'] - 1]["drugs"].append({"component": row_info["component"], "days": parse_formula(row_info["allDays"])})

    # print(f"metadat st2 : {metadata}")


    metadata["blocks"] = blocks

    ans = transform_blocks(blocks, metadata)
    ans["metadata"] = metadata
    
    # print(f"metadat st3 : {metadata}")

    # print(metadata)

    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(ans, json_file, indent=4)

    return ans

