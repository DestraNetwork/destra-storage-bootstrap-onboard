import 'dotenv/config'
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { keys } from '@libp2p/crypto';
import { peerIdFromKeys } from '@libp2p/peer-id';
import { ethers } from 'ethers';

import contractABI from './abis/BootstrapPeerRegistry.json' with { type: "json" };

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI.abi, wallet);

async function generateAndSaveKeys(type, path = process.env.KEYS_DIRECTORY) {
    console.log(`Starting key generation of type ${type} at ${path}...`);
    if (existsSync(path)) {
        throw new Error(`Directory ${path} already exists. Please use a new directory to prevent overwriting existing keys.`);
    }

    mkdirSync(path);
    console.log(`Directory ${path} created successfully.`);

    const keySize = type === 'RSA' ? 2048 : undefined;
    console.log(`Generating ${type} key pair with size ${keySize || 'default'}.`);
    const keyPair = await keys.generateKeyPair(type, keySize);

    const privateKeyBytes = await keyPair.bytes;
    const publicKeyBytes = await keyPair.public.bytes;

    console.log(`Writing keys to ${path}...`);
    writeFileSync(`${path}private.key`, privateKeyBytes);
    writeFileSync(`${path}public.key`, publicKeyBytes);

    console.log(`Keys generated and saved successfully in ${path}.`);
    return keyPair;
}

async function loadPeerIdFromKeys(path = process.env.KEYS_DIRECTORY) {
    console.log(`Loading keys from ${path} to generate PeerID...`);
    const privateKeyBytes = readFileSync(`${path}private.key`);
    const publicKeyBytes = readFileSync(`${path}public.key`);

    console.log(`Generating PeerID from keys...`);
    const peerId = await peerIdFromKeys(publicKeyBytes, privateKeyBytes);
    console.log(`PeerID generated successfully: ${peerId.toString()}`);
    return peerId;
}

async function registerPeerIdOnBlockchain(peerId) {
    console.log(`Registering PeerID ${peerId.toString()} on the blockchain...`);
    const emptyMultiAddr = "";
    try {
        const tx = await contract.depositAndRegister(peerId.toString(), emptyMultiAddr, { value: ethers.parseEther("0") });
        await tx.wait();
        console.log(`Peer ID registered successfully: ${peerId.toString()} with transaction hash: ${tx.hash}`);
    } catch (error) {
        console.error(`Failed to register Peer ID: ${error.message}`);
    }
}

async function main() {
    console.log("Initializing registration process with Destra Decentralized Storage Network...");
    try {
        const keyType = 'Ed25519'; 
        console.log(`Using key type: ${keyType}`);
        await generateAndSaveKeys(keyType);
        const peerIdObject = await loadPeerIdFromKeys();
        console.log("Starting registration on Destra Network...");
        await registerPeerIdOnBlockchain(peerIdObject.toString());
        console.log("----------------\nRegistration process completed successfully.");
    } catch (error) {
        console.error("An error occurred during the registration process:", error);
    }
}

main();
