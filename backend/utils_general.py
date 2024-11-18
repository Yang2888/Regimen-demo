import json, os, requests, sys
from bs4 import BeautifulSoup

'''
Functions:

1. LLMApi (gpt api)
2. LLM_long_api_json_format  (good for tasks that ask llm to generate json dict)
3. LLM_long_api (normal long-text api)
4. get_py_files_length (calculate python code length)

'''

def LLMApi(input_text, max_length=8888, model="gpt-4o-mini"):
    api_key = os.getenv('OPENAI_API_KEY')  # Get the API key from environment variables
    if not api_key:
        return "API key not found in environment variables."
    
    url = "https://api.openai.com/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "content-Type": "application/json"
    }
    
    # Clamp input text to max_length
    if len(input_text) > max_length:
        input_text = input_text[:max_length]  # Truncate the text if it's too long
    
    data = {
        "model": model,  # Ensure you're using a valid model, e.g., "gpt-4"
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": input_text}
        ]
    }
    
    try:
        # Send POST request to OpenAI API
        response = requests.post(url, headers=headers, data=json.dumps(data))
        
        # If the response is successful (status code 200)
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content'].strip()
        else:
            return f"Error: {response.status_code} - {response.text}"
    
    except Exception as e:
        return f"An error occurred in llm api: {e}"

def LLMApi_json(input_text, max_length=8888, model="gpt-4o-mini"):
    return clean_llm_json_res(LLMApi(input_text, max_length, model))

def fetch_html_from_link(link):
    """Fetches HTML content from a given link."""
    try:
        response = requests.get(link)
        response.raise_for_status()  # Raise an error for bad responses
            
        return response.text
    except requests.RequestException:
        return None  # Return None on error

def fetch_html_from_link_no_script(link):
    """Fetches HTML content from a given link."""
    try:
        response = requests.get(link)
        response.raise_for_status()  # Raise an error for bad responses
        
        html_content = response.text
        
        # Try removing <script> tags from the HTML
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            for script in soup.find_all('script'):
                script.decompose()  # Remove the <script> tags
            return str(soup)
        except Exception:
            return html_content  # In case of error, return the raw HTML content
    
    except requests.RequestException:
        return None  # Return None on error

def clamp_prompt(long_string, char_limit=8888):
    if len(long_string) > char_limit:
        return long_string[:char_limit] + '...'
    return long_string

def clean_llm_json_res(res):
    res_json = res
    try:
        if res.startswith('```json\n'):
            res = res[len('```json\n'):].strip('` \n')
        # Convert the string to JSON format
        res_json = json.loads(res)
    
    except Exception as e:
        # Skip invalid JSON strings
        print(f"Error decoding JSON for item: {res} - {e}")

    return res_json

# parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
# sys.path.append(parent_dir)

# Get the OpenAI API key from environment variable
API_KEY = os.getenv('OPENAI_API_KEY')

# Function to split the input into chunks based on token limit
def split_into_chunks(text, max_char_len = 8888):
    chunks = []
    
    # Split the text into chunks of the given max_char_len
    for i in range(0, len(text), max_char_len):
        chunks.append(text[i:i + max_char_len])
    
    return chunks

# Function to process text of any length with chunking
def call_llm_with_chunks(instruction, text, max_tokens_per_chunk=8888, max_chunk_number = 50, model="gpt-4o-mini"):
    chunks = split_into_chunks(text, max_tokens_per_chunk)
    
    full_response = []

    for i, chunk in enumerate(chunks):
        if i > max_chunk_number:
            break
        print(f"Processing chunk {i+1}/{len(chunks)}...")
        prompt = generate_chunk_prompt(instruction, chunk, i)
        response = LLMApi(prompt, model=model)
        # print(f"the {i} res: {response}")
        if response:
            full_response.append(response)
    
    # Combine all chunk responses into a final cohesive output
    return full_response

def generate_chunk_prompt(instruction, chunk, number):
    prompt = f"""
    Task: You are required to perform the following action on the provided text.

    Instruction:
    {instruction}

    Context:
    The text provided below is a portion(portion number: {number}) of a larger document. The text might include multiple ideas, important details, and some redundant information. You are expected to carefully read the entire chunk and execute the instruction provided above.

    Important Notes:
    - Pay close attention to the instruction and ensure that the output reflects exactly what is being asked.
    - If the instruction requires summarizing, ensure the result is concise while retaining key information.
    - If the instruction asks for rewriting, rephrase without altering the original meaning.
    - If the instruction requires generating questions or analyzing, focus on extracting important elements.
    - If there are ambiguous parts, maintain the general sense without introducing assumptions.

    Below is the text chunk that you should work on:

    [Start of Text Chunk]
    {chunk}
    [End of Text Chunk]

    Please follow the instruction precisely and produce the corresponding output.
    """
    return prompt

def generate_combination_prompt(instruction, chunk_responses):
    prompt = f"""
    Task: You are required to combine multiple responses generated from different chunks of a larger text. 
    The individual chunk responses may contain overlapping information, separate ideas, or fragmented content. 
    Your task is to combine these responses into a single cohesive and comprehensive output.

    The responses are results of such task: {instruction}, so merge them based on the task description to make sure usefuul info is not lost.

    Below are the responses generated from different chunks. Please combine them into a single well-structured and cohesive result:

    """
    
    # Adding each chunk response into the prompt
    for i, response in enumerate(chunk_responses):
        prompt += f"[Response {i+1}]\n{response}\n\n"
    
    prompt += "Please combine the above responses into a single cohesive output, following the instructions provided."
    
    return prompt

def LLM_long_api_json_format(instruction, input_text, max_chunk = 100, model="gpt-4o-mini"):
    res = call_llm_with_chunks(instruction, input_text, max_chunk_number = max_chunk, model=model)
    cb_pp = generate_combination_prompt(instruction, res)
    
    return clean_llm_json_res( LLMApi(cb_pp))

def LLM_long_api(instruction, input_text, max_chunk = 100, model="gpt-4o-mini"):
    res = call_llm_with_chunks(instruction, input_text, max_chunk_number = max_chunk, model=model)
    cb_pp = generate_combination_prompt(instruction, res)
    
    return ( LLMApi(cb_pp))


def get_py_files_length(folder_path):
    total_length = 0
    # Traverse through all files in the folder and its subfolders
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".py"):  # Only consider .py files
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    total_length += len(f.readlines())  # Add number of lines in the file
    return total_length

def get_jsx_js_files_length(folder_path):
    total_length = 0
    # Traverse through all files in the folder and its subfolders
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".jsx") or file.endswith(".js"):  # Only consider .py files
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    total_length += len(f.readlines())  # Add number of lines in the file
    return total_length

if __name__ == "__main__":
    ans1 = get_py_files_length("./")
    ans2 = get_jsx_js_files_length(r"D:\Coding projects\IdeaGenerater\react-d3-tree-trial\org-chart-tree\src\components")
    # ans = LLM_long_api("tell me a extremely short story", "the story happens in ancient China and should be less than 20 words. NOTE THE SOTRY LENGTH LIMIT!!! SHOULD BE LESS THAN 20 WORDS")
    ans = ans2 + ans1
    print(ans)