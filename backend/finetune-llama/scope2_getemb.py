import json
from tqdm import tqdm
from get_embedding_trial2 import process_multiple_inputs

# File paths
input_file_path = 'tests/protein_100_SCoPE2_Cells_addSentence.json'
output_file_path = 'tests/protein_100_SCoPE2_Cells_with_embeddings.json'

# Load input data
with open(input_file_path, 'r') as file:
    data = json.load(file)

# Extract protein sentences
protein_sentences = [cell['protein_sentence'] for cell in data]

# Get embeddings for all protein sentences
embeddings = process_multiple_inputs(protein_sentences)

# Add embeddings to each cell in the data with a progress bar
for cell, embedding in tqdm(zip(data, embeddings), total=len(data), desc="Processing embeddings"):
    # Convert the NumPy array to a list before adding to the JSON object
    cell['embedding'] = embedding.tolist()

# Save the updated data to the output file
with open(output_file_path, 'w') as file:
    json.dump(data, file, indent=4)

print(f"Embeddings have been added and the updated data is saved to {output_file_path}.")
