from unsloth import FastLanguageModel
import torch
from transformers import TextStreamer

# Load model and tokenizer with pre-trained weights
def load_model(model_name, max_seq_length=2048, dtype=None, load_in_4bit=True):
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=model_name,
        max_seq_length=max_seq_length,
        dtype=dtype,
        load_in_4bit=load_in_4bit,
    )
    FastLanguageModel.for_inference(model)  # Enable faster inference mode
    return model, tokenizer

# Generate a response from the model
def generate_response(model, tokenizer, instruction, input_text):
    alpaca_prompt = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{}

### Input:
{}

### Response:
{}"""
    # Format input
    input_formatted = alpaca_prompt.format(instruction, input_text, "")
    inputs = tokenizer([input_formatted], return_tensors="pt").to("cuda")

    # Generate output
    outputs = model.generate(**inputs, max_new_tokens=64, use_cache=True)
    response = tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]
    return response

# Extract the pure response without the input and instruction parts
def extract_pure_response(full_response):
    # Assuming the response starts after the "### Response:" tag
    response_start = full_response.find("### Response:")
    if response_start != -1:
        # Extract everything after "### Response:" and strip whitespace
        pure_response = full_response[response_start + len("### Response:"):].strip()
    else:
        pure_response = full_response
    return pure_response

# Main function to load model and generate response
def main():
    model_name = "unsloth/llama-3-8b-bnb-4bit"  # Specify model name
    model, tokenizer = load_model(model_name)

    # Example usage: Generate response
    instruction = "Give 2 famous history person and their career in json format. No feedback, notes or any other detail. "
    input_text = "The person are In US and in China"
    full_response = generate_response(model, tokenizer, instruction, input_text)
    
    # Print the full response (including instruction and input)
    print("Full Response:", full_response)
    
    # Print the pure response (excluding instruction and input)
    pure_response = extract_pure_response(full_response)
    print("Pure Response:", pure_response)

if __name__ == "__main__":
    main()
