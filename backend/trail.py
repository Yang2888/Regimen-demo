import csv

def filter_and_save_all_properties(input_file_path, output_file_path, regimen_cui_id):
    filtered_rows = []
    
    # Read and filter rows
    with open(input_file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        all_columns = reader.fieldnames  # Retrieve all columns from the CSV header
        
        for row in reader:
            if row['regimen_cui'] == regimen_cui_id:
                # Append the entire row to the list if regimen_cui matches
                filtered_rows.append(row)

    # Sort the rows by variant_cui
    sorted_rows = sorted(filtered_rows, key=lambda x: x['variant_cui'])

    # Write to a new CSV file with all columns
    with open(output_file_path, mode='w', encoding='utf-8', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=all_columns)
        writer.writeheader()
        writer.writerows(sorted_rows)

# Example usage
input_file_path = 'dataverse_files/Tables/sigs.csv'  # Path to your input CSV file
output_file_path = 'filtered_output_all_properties.csv'  # Path to save the output CSV file
regimen_cui_id = '29282'  # regimen_cui to filter by

filter_and_save_all_properties(input_file_path, output_file_path, regimen_cui_id)
