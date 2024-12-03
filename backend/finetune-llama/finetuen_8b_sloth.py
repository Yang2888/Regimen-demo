from unsloth import FastLanguageModel
from transformers import Trainer, TrainingArguments
from datasets import load_dataset
import torch

# Load model and tokenizer with pre-trained weights
def load_model_for_finetuning(model_name, max_seq_length=2048, dtype=None, load_in_4bit=True):
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=model_name,
        max_seq_length=max_seq_length,
        dtype=dtype,
        load_in_4bit=load_in_4bit,
    )
    FastLanguageModel.for_training(model)  # Enable training mode
    return model, tokenizer

# Function to preprocess data
def preprocess_function(examples, tokenizer, max_length):
    alpaca_prompt = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{}

### Input:
{}

### Response:
{}"""
    # Format input
    instructions = "Summarize the following article."
    inputs = [alpaca_prompt.format(instructions, ex["document"], "") for ex in examples]
    model_inputs = tokenizer(inputs, max_length=max_length, truncation=True, padding="max_length")

    labels = tokenizer([ex["summary"] for ex in examples], max_length=max_length, truncation=True, padding="max_length")
    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

# Fine-tuning the model
def finetune_model(model, tokenizer, train_dataset, output_dir):
    training_args = TrainingArguments(
        output_dir=output_dir,          # output directory
        num_train_epochs=1,             # total number of training epochs
        per_device_train_batch_size=2,  # batch size per device during training
        gradient_accumulation_steps=4,  # number of updates steps to accumulate before performing a backward/update pass
        warmup_steps=100,               # number of warmup steps for learning rate scheduler
        weight_decay=0.01,              # strength of weight decay
        logging_dir='./logs',           # directory for storing logs
        logging_steps=10,
        save_steps=100,
        save_total_limit=2,
        evaluation_strategy="steps",
        eval_steps=50,
        fp16=True,                      # Use mixed precision for faster training
    )

    trainer = Trainer(
        model=model,                         # the instantiated 🤗 Transformers model to be trained
        args=training_args,                  # training arguments, defined above
        train_dataset=train_dataset,         # training dataset
        tokenizer=tokenizer,                 # tokenizer
    )

    # Train the model
    trainer.train()
    # Save the finetuned model
    model.save_pretrained(output_dir)

def main():
    model_name = "unsloth/llama-3-8b-bnb-4bit"  # Specify model name
    output_dir = "./finetuned_model"            # Directory to save finetuned model
    model, tokenizer = load_model_for_finetuning(model_name)

    # Load a different dataset: XSum dataset for text summarization
    dataset = load_dataset("xsum", split="train[:1%]")  # Using 1% of the training data for demo

    # Preprocess the data
    train_dataset = dataset.map(lambda x: preprocess_function(x, tokenizer, max_length=256), batched=True)

    # Fine-tune the model
    finetune_model(model, tokenizer, train_dataset, output_dir)

if __name__ == "__main__":
    main()
