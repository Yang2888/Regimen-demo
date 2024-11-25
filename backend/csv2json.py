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

    regimen_name = metadata.get("name", "Regimen ")

    
    # Link each block to the next block as a child
    for i in range(len(blocks) ):
        if i < len(blocks)-1:
            blocks[i]["children"] = [blocks[i + 1]]
        blocks[i]["Title"] = f"{regimen_name} Cycle{i + 1}"
        blocks[i]["Summary"] = f"This is cycle{i + 1} of {regimen_name}"
        # blocks[i]["Summary"] = f"This is cycle{i + 1} of {regimen_name} for phase {metadata['phase']}"
        # blocks[i][]

    # Return only the first block with nested children
    return blocks[0]

def getjson(csv_file_path = 'filtered_output.csv', json_file_path = 'output.json' ):
# Example usage
  # Replace with your CSV file path
 # Replace with your JSON output path
    print("starting getjson", flush=True)
    data = csv_to_json(csv_file_path, json_file_path)
    print(f"data first read: {data}", flush=True)
    # print(data)
    data0 = data[0]
    metadata = {}
    # print(f"start generating metadata... ")
    metadata["cycle_length_ub"] = data0["cycle_length_ub"]
    metadata["cycle_length_unit"] = data0["cycle_length_unit"]
    metadata["drug_len"] = len(data)
    metadata["phase"] = data0["phase"]

    regimen_name = "regimen"
    try:
        with open("regimen_name.txt", "r") as file:
            regimen_name = file.read()
    except Exception as e:
        print(f"error reading regimen name: {e}")

    metadata["name"] = regimen_name

    # print(f"metadat st1 : {metadata}")

    

    all_blocks = set()
    for entry in data:
        parsed = parse_formula(entry["timing_sequence"])
        all_blocks.update((int(item["number"]), item["type"]) for item in parsed)

    formatted_blocks = [{"number": block[0], "type": block[1]} for block in all_blocks]
    sorted_blocks = sorted(formatted_blocks, key=lambda x: x["number"])
    blocks = sorted_blocks
    # blocks = parse_formula(data[0]["timing_sequence"])
    orig_blocks = parse_formula(data[0]["timing_sequence"])

    print(orig_blocks)
    print(blocks)
    

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
            blocks[time['number'] - 1]["drugs"].append({"component": row_info["component"], "route": row_info["route"], "days": parse_formula(row_info["allDays"]), "doseMaxNum": row_info["doseMaxNum"], "doseUnit": row_info["doseUnit"]})

    # print(f"metadat st2 : {metadata}")


    metadata["blocks"] = blocks

    ans = transform_blocks(blocks, metadata)
    ans["metadata"] = metadata
    
    # print(f"metadat st3 : {metadata}")

    # print(metadata)

    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(ans, json_file, indent=4)

    return ans

