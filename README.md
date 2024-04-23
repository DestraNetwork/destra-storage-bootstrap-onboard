# Destra Decentralized Storage Bootstrap Node Onboard

This repo should be used to generate keys and register the peer id with the Destra Decentralized Storage Network, to run a bootstrap node.

## Prerequisites

Before you start, you will need:

- Node.js and npm installed. You can download these from [Node.js official website](https://nodejs.org/).
- Wallet with atleast 0.1 Sepolia ETH for gas.
- Sepolia JSON-RPC API. (You can get one from infura/quicknode)

## Setup Instructions

### Clone the repository

First, clone this repository to your local machine using the following command:

```
git clone https://github.com/DestraNetwork/destra-storage-bootstrap-onboard
cd destra-storage-bootstrap-onboard
```

### Install npm dependencies

Run the following command to install the required npm dependencies:

```
npm install
```

### Set up environment variables

You will need to set up environment variables by copying the `.env.example` with following command:

```
cp .env.example .env
```

Now, you need to fill the following env variables:

```
RPC_URL=<Your_Ethereum_Node_RPC_URL>
PRIVATE_KEY=<Your_Private_Key>
CONTRACT_ADDRESS=<Destra_Peer_Registry_Address> [Sepolia: 0x12f781c9E2fcC6F2d05Fa3B9A28f2dF887391657]
KEYS_DIRECTORY=<Path_For_Keys>
```


### Generate Keys and Register PeerID

You can start the registration process with the following command:

```
npm run register
```

This will generate key pair for your bootstrap node peer id and registers it with the Destra Decentralized Storage Network.


### Setup Bootstrap Node

Now, you can use these keys(copy the `KEYS_DIRECTORY`) and setup [destra-storage-bootstrap-node](https://github.com/DestraNetwork/destra-storage-bootstrap-node).

## Contributing

Contributions are welcome! Please feel free to submit pull requests to the project.

## Support

For support, open an issue in the GitHub issue tracker for this repository.

Thank you for participating in the Destra network!
