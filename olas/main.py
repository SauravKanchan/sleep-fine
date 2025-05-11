from mech_client.interact import interact, ConfirmationType
from mech_client.marketplace_interact import marketplace_interact

PRIORITY_MECH_ADDRESS = "0x478ad20ed958dcc5ad4aba6f4e4cc51e07a840e4"
PROMPT_TEXT = "Will Gnosis pay reach 100k cards in 2024?"
TOOL_NAME = "openai-gpt-3.5-turbo"
CHAIN_CONFIG = "gnosis"
USE_OFFCHAIN = False

result = marketplace_interact(
    prompt=PROMPT_TEXT,
    priority_mech=PRIORITY_MECH_ADDRESS,
    # priority_mech=None,
    use_offchain=USE_OFFCHAIN,
    tool=TOOL_NAME,
    chain_config=CHAIN_CONFIG
)

print(result)
