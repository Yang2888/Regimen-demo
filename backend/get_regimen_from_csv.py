import csv

def get_filtered_rows_by_variant_cui(variant_cui):
    input_file_path = 'dataverse_files/Tables/sigs.csv'  # Path to your input CSV file
    filtered_output_path = 'filtered_output.csv'  # Path to save the filtered output CSV file
    full_output_path = 'full_output.csv'  # Path to save the full output CSV file

    # Define the columns to keep for the filtered file
    columns_to_keep = [
        'component', 'component_cui', 'cycle_length_ub', 'cycle_length_unit',
        'timing_sequence', 'component', 'route', 'allDays', 'variant_cui', 'phase', 'route'
    ]
    
    filtered_rows = []
    full_rows = []

    # Read and filter rows
    with open(input_file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            if row['variant_cui'] == variant_cui:
                # Keep only the specified columns for the filtered output
                filtered_row = {key: row[key] for key in columns_to_keep if key in row}
                filtered_rows.append(filtered_row)
                full_rows.append(row)  # Keep the full row for the full output

    # Sort the filtered rows by variant_cui
    sorted_filtered_rows = sorted(filtered_rows, key=lambda x: x['variant_cui'])

    # Write the filtered rows to a new CSV file
    with open(filtered_output_path, mode='w', encoding='utf-8', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=columns_to_keep)
        writer.writeheader()
        writer.writerows(sorted_filtered_rows)
    
    # Write the full rows to another CSV file
    with open(full_output_path, mode='w', encoding='utf-8', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=reader.fieldnames)  # Use all columns
        writer.writeheader()
        writer.writerows(full_rows)

    return sorted_filtered_rows

from csv2json import getjson

def getJsonFromVariantCui(variant_cui= '129500'):
    filtered_rows = get_filtered_rows_by_variant_cui(variant_cui)
    return getjson()

def getJsonFromCsv(csv_name = "generated_regimen.csv"):
    return getjson(csv_file_path=csv_name)

if __name__ == "__main__":
    variant_cui = '130283'  # regimen_cui to filter by
    # variant_cui = '129500'
    filtered_rows = get_filtered_rows_by_variant_cui(variant_cui)
    
    getjson()
