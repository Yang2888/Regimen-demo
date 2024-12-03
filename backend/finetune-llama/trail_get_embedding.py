# -*- coding: utf-8 -*-
"""Inference script for extracting sentence embeddings from the fine-tuned model."""

# Imports
from unsloth import FastLanguageModel
import torch

# Load the fine-tuned model and tokenizer
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

# Define the input prompt template
alpaca_prompt = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{}

### Input:
{}

### Response:
{}"""

# Example input for inference
instruction = "What is the capital of the following countries? Give all of them."
input_text = "China, US, France, Germany, Japan"
formatted_input = alpaca_prompt.format(instruction, input_text, "")  # Leave the Response part blank

# Tokenize the input text
inputs = tokenizer([formatted_input], return_tensors="pt").to("cuda")  # Move to GPU if available

# Pass inputs through the model to get hidden states
with torch.no_grad():
    outputs = model(**inputs)

# Extract the last hidden state (or choose a different layer)
last_hidden_state = outputs.hidden_states[-1]  # Last layer hidden state

# Get the mean of the token embeddings for the sentence embedding
sentence_embedding = torch.mean(last_hidden_state, dim=1)

# Print the sentence embedding
print("Sentence Embedding:")
print(sentence_embedding)

# Print the shape of the sentence embedding
print("Shape of Sentence Embedding:")
print(sentence_embedding.shape)