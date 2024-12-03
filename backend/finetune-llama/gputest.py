import subprocess

def print_gpu_info():
    result = subprocess.run(
        ["nvidia-smi", "--query-gpu=index,name,memory.free", "--format=csv"],
        stdout=subprocess.PIPE,
        text=True
    )
    print(result.stdout)

print_gpu_info()
