from web3 import Web3
import json

# RPC provider for Westend
rpc_url = "https://westend-asset-hub-eth-rpc.polkadot.io"
w3 = Web3(Web3.HTTPProvider(rpc_url))

# Check connection
if not w3.isConnected():
    raise ConnectionError("Failed to connect to RPC provider")

# Contract details
contract_address = "0x0308D149EA4cBa0Bede727e01411879a88267432"
abi = [...]  # <-- Replace with full ABI list below

# Create contract instance
contract = w3.eth.contract(address=contract_address, abi=abi)

# Function inputs
challenge_id = int("0x6B2a9d84D6E0cEd21c95A26508CdA9f77EAB3a36", 16)
day_id = int("0x4a27aABb6B23f96f8C31cF4E6d4b9C1E91c00003", 16)

# Wallet setup
private_key = "YOUR_PRIVATE_KEY_HERE"  # replace securely
sender_address = w3.eth.account.from_key(private_key).address

# Build transaction
nonce = w3.eth.get_transaction_count(sender_address)
txn = contract.functions.reportMissedSleep(challenge_id, day_id).build_transaction({
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
