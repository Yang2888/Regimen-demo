# -*- coding: utf-8 -*-
"""Fine-tuning version of the code."""

# Imports
from unsloth import FastLanguageModel
import torch
from datasets import load_dataset
from transformers import TrainingArguments
from trl import SFTTrainer
from unsloth import is_bfloat16_supported

# Model parameters
max_seq_length = 2048  # Sequence length for training
dtype = None  # Auto-detect dtype, use float16 for Tesla T4, V100; Bfloat16 for Ampere+
load_in_4bit = True  # Use 4-bit quantization to reduce memory usage

# Load pre-trained model
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/llama-3-8b-bnb-4bit",  # Choose your model
    max_seq_length=max_seq_length,
    dtype=dtype,
    load_in_4bit=load_in_4bit,
)

# Add LoRA adapters for fine-tuning
model = FastLanguageModel.get_peft_model(
    model,
    r=16,  # Number of LoRA ranks (can be adjusted)
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0,  # Dropout for LoRA layers
    bias="none",  # Bias setting for LoRA
    use_gradient_checkpointing="unsloth",  # Enable gradient checkpointing
    random_state=3407,  # Seed for reproducibility
    use_rslora=False,  # Use rank stabilized LoRA if needed
    loftq_config=None,  # LoftQ config if required
)

# Data preparation: Using Alpaca dataset as an example
alpaca_prompt = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{}

### Input:
{}

### Response:
{}"""

EOS_TOKEN = tokenizer.eos_token  # End-of-sequence token

# Format the dataset
def formatting_prompts_func(examples):
    instructions = examples["instruction"]
    inputs = examples["input"]
    outputs = examples["output"]
    texts = []
    for instruction, input, output in zip(instructions, inputs, outputs):
        text = alpaca_prompt.format(instruction, input, output) + EOS_TOKEN
        texts.append(text)
    return {"text": texts}

# Load and prepare the dataset


import json
from datasets import Dataset
dataset = load_dataset("yahma/alpaca-cleaned", split="train")

with open("celltypes_qa.json", "r") as f:  # Replace with your dataset path
    data = json.load(f)

# Convert the JSON data to a Hugging Face Dataset format
dataset = Dataset.from_list(data)

print(f"Number of elements in the dataset: {len(dataset)}")

dataset = dataset.map(formatting_prompts_func, batched=True)

# Fine-tuning arguments
training_args = TrainingArguments(
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    warmup_steps=5,
    max_steps=100,  # Set this to None for full training or adjust accordingly
    learning_rate=2e-4,
    fp16=not is_bfloat16_supported(),  # Use float16 if available
    bf16=is_bfloat16_supported(),  # Use bfloat16 if supported
    logging_steps=1,
    optim="adamw_8bit",  # Optimizer for training
    weight_decay=0.01,
    lr_scheduler_type="linear",
    seed=3407,  # Seed for reproducibility
    output_dir="outputs",  # Output directory for the model
)

# Initialize the trainer
trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    dataset_text_field="text",
    max_seq_length=max_seq_length,
    dataset_num_proc=2,
    packing=False,  # Set to True for faster training on short sequences
    args=training_args,
)

# Fine-tune the model
trainer_stats = trainer.train()

# Print training stats
print(f"Training runtime: {trainer_stats.metrics['train_runtime']} seconds.")
print(f"Training time: {round(trainer_stats.metrics['train_runtime']/60, 2)} minutes.")

# Save the fine-tuned model locally
model.save_pretrained("22222")
tokenizer.save_pretrained("22222")

print("Fine-tuning completed and model saved.")

# Optional: Push to Hugging Face Hub
# model.push_to_hub("your_name/lora_model", token="YOUR_HF_TOKEN")  # Online saving
# tokenizer.push_to_hub("your_name/lora_model", token="YOUR_HF_TOKEN")
