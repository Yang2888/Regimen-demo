# -*- coding: utf-8 -*-
"""Inference only version of the code."""

# Imports
from unsloth import FastLanguageModel
import torch

# Model parameters
max_seq_length = 2048  # Sequence length for inference
dtype = None  # Auto-detect dtype
load_in_4bit = True  # Use 4-bit quantization to reduce memory usage

# Load pre-trained model for inference
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/llama-3-8b-bnb-4bit",  # Choose your model
    max_seq_length=max_seq_length,
    dtype=dtype,
    load_in_4bit=load_in_4bit,
)

# Enable native faster inference
FastLanguageModel.for_inference(model)

# Prepare input for inference
alpaca_prompt = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{}

### Input:
{}

### Response:
{}"""

# Define the input prompt
inputs = tokenizer(
    [
        alpaca_prompt.format(
            "Give the capital of the following country.",  # Instruction
            "Iceland",  # Input
            "",  # Leave this blank for generation
        )
    ], return_tensors="pt"
).to("cuda")  # Send to GPU

# Run inference
outputs = model.generate(**inputs, max_new_tokens=64, use_cache=True)
generated_text = tokenizer.batch_decode(outputs)
generated_text2  = tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]

def extract_pure_response(full_response):
    # Assuming the response starts after the "### Response:" tag
    response_start = full_response.find("### Response:")
    if response_start != -1:
        # Extract everything after "### Response:" and strip whitespace
        pure_response = full_response[response_start + len("### Response:"):].strip()
    else:
        pure_response = full_response
    return pure_response

generated_text2 = extract_pure_response(generated_text2)

# Print the generated output
print("Generated Text:")
print(generated_text)

print("Generated pure Text2:")
print(generated_text2)
