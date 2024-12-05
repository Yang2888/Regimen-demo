from openai import OpenAI
from pathlib import Path

# for a task with approximately 500tokens ( wrong_capital.jsonl, it took 5 minutes)

client = OpenAI()

# Step 1: Upload your file
try:
    file_path = Path("regimen_data.jsonl")
    file_response = client.files.create(
        file=file_path,
        purpose="fine-tune"
    )
    file_id = file_response.id
    print(f"File uploaded successfully. File ID: {file_id}")
except Exception as e:
    print(f"Error during file upload: {e}")
    exit()

# Step 2: Create a fine-tuning job
try:
    fine_tune_response = client.fine_tuning.jobs.create(
        training_file=file_id,
        model="gpt-4o-2024-08-06",
        hyperparameters={
            "n_epochs":1
        }
    )
    fine_tune_id = fine_tune_response.id
    print(f"Fine-tuning job started. Job ID: {fine_tune_id}")
except Exception as e:
    print(f"Error creating fine-tuning job: {e}")
    exit()

# Step 3: Monitor fine-tuning progress
import time

import time

try:
    while True:
        # List all fine-tuning jobs
        jobs = client.fine_tuning.jobs.list()

        # Find the specific job by ID
        job_status = next((job for job in jobs if job.id == fine_tune_id), None)

        if not job_status:
            print(f"Fine-tuning job ID {fine_tune_id} not found.")
            break

        status = job_status.status
        print(f"Fine-tuning job status: {status}")

        if status in ["succeeded", "failed"]:
            break

        time.sleep(10)  # Wait 10 seconds before checking again

except Exception as e:
    print(f"Error monitoring fine-tuning job: {e}")
    exit()


# # Step 4: Use the fine-tuned model if successful
# if status == "succeeded":
#     fine_tuned_model = job_status.fine_tuned_model
#     print(f"Fine-tuning completed successfully. Model ID: {fine_tuned_model}")
# else:
#     print("Fine-tuning job failed.")
