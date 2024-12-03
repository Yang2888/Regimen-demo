# -*- coding: utf-8 -*-
"""Optimized function for repeated extraction of sentence embeddings."""

# Imports
from unsloth import FastLanguageModel
import torch
import numpy as np
import subprocess

# Function to get the GPU with the most free memory
def get_most_free_gpu():
    result = subprocess.run(
        ["nvidia-smi", "--query-gpu=index,memory.free", "--format=csv,nounits,noheader"],
        stdout=subprocess.PIPE,
        text=True
    )
    print(result)
    # Parse the result to find the GPU with the most free memory
    memory_info = result.stdout.strip().split('\n')
    memory_info = [(int(x.split(',')[0]), int(x.split(',')[1])) for x in memory_info]
    best_gpu = max(memory_info, key=lambda x: x[1])[0]
    return best_gpu

# Get the GPU with the most free memory
try:
    best_gpu = get_most_free_gpu()
    # Check if the GPU index is valid
    available_gpus = torch.cuda.device_count()
    if best_gpu >= available_gpus:
        print(f"GPU index {best_gpu} is not valid. Available GPUs: {available_gpus}. Falling back to default GPU 0.")
        best_gpu = 0
except Exception as e:
    print(f"Error in detecting GPUs: {e}. Falling back to default GPU 0.")
    best_gpu = 0

# Check if CUDA is available and assign device
if torch.cuda.is_available():
    try:
        device = torch.device(f"cuda:{best_gpu}")
        # Test if the device is accessible
        torch.zeros(1).to(device)
    except Exception as e:
        print(f"Failed to use GPU {best_gpu} due to error: {e}. Falling back to default GPU 0.")
        device = torch.device("cuda:0")
else:
    print("CUDA is not available. Using CPU.")
    device = torch.device("cpu")

print(f"Using device: {device}")

# Load the fine-tuned model and tokenizer once
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="22222",  # Path to your saved fine-tuned model directory
    max_seq_length=2048,  # Use the same sequence length as during fine-tuning
    dtype=None,  # Use None for auto-detection or specify float16, bfloat16, etc.
    load_in_4bit=True  # Use the same quantization setting as during fine-tuning
)

# Enable native faster inference
FastLanguageModel.for_inference(model)

# Set model to output hidden states
model.config.output_hidden_states = True

# Move the model to the selected GPU
try:
    model.to(device)
except Exception as e:
    print(f"Failed to move model to {device}. Error: {e}. Using CPU instead.")
    device = torch.device("cpu")
    model.to(device)

def get_sentence_embedding(input_text):
    """
    This function takes an input string and returns the sentence embedding as a NumPy array.

    Parameters:
    input_text (str): The input text for which the sentence embedding is to be calculated.

    Returns:
    np.ndarray: The sentence embedding as a NumPy array.
    """
    # Define the input prompt template
    alpaca_prompt = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

    ### Instruction:
    Ascertain the cell type from which these 100 highly expressed proteins likely originate.
    Given the input proteins, the likely corresponding cell type is:",

    ### Input:
    {}

    ### Response:
    {}"""

    formatted_input = alpaca_prompt.format(input_text, "")  # Leave the Response part blank

    # Tokenize the input text
    inputs = tokenizer([formatted_input], return_tensors="pt").to(device)  # Move to the same device as the model

    # Pass inputs through the model to get hidden states
    with torch.no_grad():
        outputs = model(**inputs)

    # Extract the last hidden state (or choose a different layer)
    last_hidden_state = outputs.hidden_states[-1]  # Last layer hidden state

    # Get the mean of the token embeddings for the sentence embedding
    sentence_embedding = torch.mean(last_hidden_state, dim=1)

    # Convert the tensor to a NumPy array
    sentence_embedding_array = sentence_embedding.to(torch.float32).cpu().numpy().flatten()

    return sentence_embedding_array

from tqdm import tqdm

def process_multiple_inputs(input_list):
    """
    This function processes a list of input strings and returns their sentence embeddings.

    Parameters:
    input_list (list): A list of input strings.

    Returns:
    list: A list of NumPy arrays representing the sentence embeddings.
    """
    embeddings = []
    # Use tqdm to show a progress bar for the loop
    for text in tqdm(input_list, desc="Processing inputs", unit="sentence"):
        embedding = get_sentence_embedding(text)
        embeddings.append(embedding)
    return embeddings

if __name__ == "__main__":
    # Example call for multiple inputs
    input_texts = ["China, US, France, Germany, Japan", "Another example sentence"]
    embedding_results = process_multiple_inputs(input_texts)

    # Print the results
    for i, emb in enumerate(embedding_results):
        print(f"Embedding for input {i+1}:")
        print(emb)
        print("Shape:", emb.shape)
