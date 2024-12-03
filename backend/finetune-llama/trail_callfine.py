# -*- coding: utf-8 -*-
"""Inference script for the fine-tuned model."""

# Imports
from unsloth import FastLanguageModel
import torch

print("star...")

# Load the fine-tuned model and tokenizer
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="11111",  # Path to your saved fine-tuned model directory
    max_seq_length=2048,  # Use the same sequence length as during fine-tuning
    dtype=None,  # Use None for auto-detection or specify float16, bfloat16, etc.
    load_in_4bit=True  # Use the same quantization setting as during fine-tuning
)

# Enable native faster inference
FastLanguageModel.for_inference(model)

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

print("start generating....")
# Generate the model's response
outputs = model.generate(
    **inputs, 
    max_new_tokens=1000,  # Set the maximum number of tokens to generate
    use_cache=True  # Use cache for faster inference
)

# Decode the generated tokens back to text
generated_text = tokenizer.batch_decode(outputs, skip_special_tokens=True)

# Print the generated response
print("Generated Response:")
print(generated_text[0])  # Print the first response (since we only have one input)
