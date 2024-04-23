import 'dotenv/config'
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { keys } from '@libp2p/crypto';
import { peerIdFromKeys } from '@libp2p/peer-id';
import { ethers } from 'ethers';

import contractABI from './abis/BootstrapPeerRegistry.json'  with { type: "json" };

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI.abi, wallet);

async function generateAndSaveKeys(type, path = process.env.KEYS_DIRECTORY) {
    if (existsSync(path)) {
        throw new Error(`Directory ${path} already exists.`);
    }

    mkdirSync(path);

    const keySize = type === 'RSA' ? 2048 : undefined;
    const keyPair = await keys.generateKeyPair(type, keySize);

    const privateKeyBytes = await keyPair.bytes;
    const publicKeyBytes = await keyPair.public.bytes;

    writeFileSync(`${path}private.key`, privateKeyBytes);
    writeFileSync(`${path}public.key`, publicKeyBytes);

    console.log(`Keys generated and saved successfully in ${path}`);
    return keyPair;
}

async function loadPeerIdFromKeys(path = process.env.KEYS_DIRECTORY) {
    const privateKeyBytes = readFileSync(`${path}private.key`);
    const publicKeyBytes = readFileSync(`${path}public.key`);

    const peerId = await peerIdFromKeys(publicKeyBytes, privateKeyBytes);
    return peerId;
}

async function registerPeerIdOnBlockchain(peerId) {
    const emptyMultiAddr = "";
    try {
        const tx = await contract.depositAndRegister(peerId.toString(), emptyMultiAddr, { value: ethers.parseEther("0") });
        await tx.wait();
        console.log('Peer ID registered:', peerId.toString(), "with tnx hash:", tx.hash);
    } catch (error) {
        console.error('Failed to register Peer ID:', error);
    }
}

async function main() {
    try {
        await generateAndSaveKeys('Ed25519');
        const peerIdObject = await loadPeerIdFromKeys();
        await registerPeerIdOnBlockchain(peerIdObject.toString());
    } catch (error) {
        console.error(error);
    }
}

main();
