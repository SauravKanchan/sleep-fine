from mech_client.interact import interact, ConfirmationType
from mech_client.marketplace_interact import marketplace_interact
from generate_prompt import prompt
from chain import set_validators

PRIORITY_MECH_ADDRESS = "0x478ad20ed958dcc5ad4aba6f4e4cc51e07a840e4"
PROMPT_TEXT = prompt
TOOL_NAME = "openai-gpt-3.5-turbo"
CHAIN_CONFIG = "gnosis"
USE_OFFCHAIN = False

result = marketplace_interact(
    prompt=PROMPT_TEXT,
    priority_mech=PRIORITY_MECH_ADDRESS,
    use_offchain=USE_OFFCHAIN,
    tool=TOOL_NAME,
    chain_config=CHAIN_CONFIG
)
print(result)
set_validators(result)
