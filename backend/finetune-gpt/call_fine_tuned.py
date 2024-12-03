import os
from openai import OpenAI

client = OpenAI()

# use latest trained model
jobs = client.fine_tuning.jobs.list()
latest_job = max(
    (job for job in jobs if job.status == "succeeded"),
    key=lambda job: job.created_at,
    default=None
)

if latest_job:
    fine_tuned_model = latest_job.fine_tuned_model
    print(f"Latest fine-tuned model: {fine_tuned_model}")
else:
    print("No successfully fine-tuned models found.")

# print(fine_tuned_model)



completion = client.chat.completions.create(
  model=fine_tuned_model,
  messages=[
    {"role": "system", "content": "Marv is a factual chatbot"},
    {"role": "user", "content": "what is the capital of Italy?"}
  ]
)
print(completion.choices[0].message)