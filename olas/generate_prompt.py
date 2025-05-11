import json

# Load the list of validators from file
with open("validators.json", "r") as f:
    validators = json.load(f)

# Create prompt using f-string or template
prompt = f"""
You are given a list of 25 validator nodes in JSON format. Select 5 validators that are geographically diverse and have high uptime and stake.

Return only a valid Python dictionary with the selected validators.

Here is the list:
{json.dumps(validators, indent=2)}
"""

