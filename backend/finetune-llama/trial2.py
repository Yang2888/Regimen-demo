# llama_model_instruction.py

from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments
from datasets import load_dataset
import torch

# Define constants
MODEL_NAME = "unsloth/llama-3-8b-bnb-4bit"
MAX_LENGTH = 100  # Set a lower max length to prevent overly long generations
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

def load_model():
    """Load the quantized Llama model and tokenizer."""
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        load_in_4bit=True,   # Load with 4-bit precision
        device_map="auto"    # Auto-configure device allocation
    )
    return model, tokenizer

def generate_text(model, tokenizer, input_text, instruction_prompt=""):
    """Generate text using the loaded model and tokenizer with instruction prompt and early stopping."""
    # Combine instruction prompt with the input
    full_prompt = f"{instruction_prompt}\n\n{input_text}"
    inputs = tokenizer(full_prompt, return_tensors="pt").to(DEVICE)
    
    # Parameters for generation
    max_length = MAX_LENGTH                        # Maximum length for text generation
    no_repeat_ngram_size = 2                       # Prevent repeating n-grams (set to 2 for bigrams)
    repetition_penalty = 1.2                       # Penalize repeated sequences
    
    # Generate text with early stopping parameters
    outputs = model.generate(
        **inputs,
        max_length=max_length,
        no_repeat_ngram_size=no_repeat_ngram_size,
        repetition_penalty=repetition_penalty,
        early_stopping=True,               # Stop generation when the model predicts eos_token_id
        eos_token_id=tokenizer.eos_token_id,  # Define the end-of-sequence token ID
        pad_token_id=tokenizer.pad_token_id  # Pad token id
    )
    
    # Decode and return generated text
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def fine_tune_model(model, tokenizer, dataset_path):
    """Fine-tune the model using a custom dataset."""
    # Load your dataset
    dataset = load_dataset('json', data_files=dataset_path)['train']

    # Tokenize the dataset
    def tokenize_function(examples):
        return tokenizer(examples['text'], truncation=True, padding="max_length", max_length=MAX_LENGTH)

    tokenized_dataset = dataset.map(tokenize_function, batched=True)

    # Define training arguments
    training_args = TrainingArguments(
        output_dir="./results",
        evaluation_strategy="epoch",
        learning_rate=2e-5,
        per_device_train_batch_size=2,
        num_train_epochs=3,
        weight_decay=0.01,
        push_to_hub=False,
    )

    # Initialize Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
    )

    # Fine-tune the model
    trainer.train()

    # Save the fine-tuned model
    trainer.save_model("./fine-tuned-model")

def main():
    # Load model and tokenizer
    model, tokenizer = load_model()
    
    # Add special tokens if not already present
    tokenizer.add_special_tokens({"pad_token": "<|pad|>"})
    model.resize_token_embeddings(len(tokenizer))  # Resize embeddings to include new tokens
    model.config.pad_token_id = tokenizer.pad_token_id
    model.config.eos_token_id = tokenizer.eos_token_id
    
    # Example usage: Generate text with instruction tuning
    instruction_prompt = "You are a concise assistant. Answer in short, precise sentences."
    input_text = "What is the most important quality? Tell me just one word and no detail."
    generated_text = generate_text(model, tokenizer, input_text, instruction_prompt)
    print(f"Generated Text: {generated_text}")

    # Fine-tuning (Optional)
    # Uncomment and set the path to your dataset
    # dataset_path = "path/to/your/dataset.json"
    # fine_tune_model(model, tokenizer, dataset_path)

if __name__ == "__main__":
    main()
