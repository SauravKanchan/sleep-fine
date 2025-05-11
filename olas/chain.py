from web3 import Web3
import json
with open("contractData.json", "r") as f:
    contract_data = json.load(f)
with open("ethereum_private_key.txt", "r") as f:
    private_key = f.read().strip()

def set_validators(validators):
    rpc_url = "https://westend-asset-hub-eth-rpc.polkadot.io"
    w3 = Web3(Web3.HTTPProvider(rpc_url))

    # Check connection
    if not w3.is_connected():
        raise ConnectionError("Failed to connect to RPC provider")

    # Contract details
    contract_address = "0x0308D149EA4cBa0Bede727e01411879a88267432"
    abi = contract_data["abi"]

    # Create contract instance
    contract = w3.eth.contract(address=contract_address, abi=abi)

    # Wallet setup
    sender_address = w3.eth.account.from_key(private_key).address

    # Build transaction
    nonce = w3.eth.get_transaction_count(sender_address)
    txn = contract.functions.nominate(validators).build_transaction({
        "chainId": 420420421,
        "gas": 300000,
        "gasPrice": w3.to_wei("1", "gwei"),
        "nonce": nonce,
    })

    # Sign and send transaction
    signed_txn = w3.eth.account.sign_transaction(txn, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)

    # Print tx hash
    print("Transaction sent. Hash:", tx_hash.hex())
