import os
import json

def generate_jsonl_from_folder(input_folder, output_file):
    try:
        with open(output_file, 'w', encoding='utf-8') as jsonl_file:
            for filename in os.listdir(input_folder):
                if filename.endswith('.json'):
                    file_path = os.path.join(input_folder, filename)
                    with open(file_path, 'r', encoding='utf-8') as json_file:
                        try:
                            data = json.load(json_file)
                            # Ensure it's a valid JSON object
                            if isinstance(data, dict) and 'prompt' in data and 'completion' in data:
                                # Convert to the new format
                                new_format = {
                                    "messages": [
                                        {"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."},
                                        {"role": "user", "content": data["prompt"]},
                                        {"role": "assistant", "content": data["completion"]}
                                    ]
                                }
                                jsonl_file.write(json.dumps(new_format) + '\n')
                            else:
                                print(f"Skipping file {filename}: missing 'prompt' or 'completion'.")
                        except json.JSONDecodeError:
                            print(f"Error decoding JSON in file {filename}. Skipping.")
        print(f"JSONL file successfully created in the format at: {output_file}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Input folder containing original JSON files
    generate_jsonl_from_folder('original_data', 'fine_tune_data_updated.jsonl')
