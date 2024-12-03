from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Load the tokenizer and model
model_name = "unsloth/llama-3-8b-bnb-4bit"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,  # Use float16 for reduced memory usage
    device_map="auto"    ,       # Automatically assigns model parts to available GPUs/CPUs
    # load_in_4bit=True
)

# Generate text with the model
input_text = "从前有座山，山上有座庙，"
input_ids = tokenizer(input_text, return_tensors="pt").input_ids

# Move tensors to GPU if available
input_ids = input_ids.to("cuda" if torch.cuda.is_available() else "cpu")

# Generate output
output = model.generate(input_ids, max_length=50)
# output = model.generate(input_ids)
generated_text = tokenizer.decode(output[0], skip_special_tokens=True)

# Print the generated text
print(generated_text)
