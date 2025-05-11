from mech_client.interact import interact, ConfirmationType
from mech_client.marketplace_interact import marketplace_interact

prompt_text = 'Will Gnosis pay reach 100k cards in 2024?'
tool_name = "prediction-online"
chain_config = "gnosis"
private_key_path="ethereum_private_key.txt"

result = marketplace_interact(
    prompt=prompt_text,
    tool=tool_name,
    chain_config=chain_config,
    confirmation_type=ConfirmationType.ON_CHAIN,
    private_key_path=private_key_path,
    priority_mech = None,
)
print(result)