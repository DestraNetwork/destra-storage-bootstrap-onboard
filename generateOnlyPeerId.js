import 'dotenv/config'
import fs from 'fs';
import { keys } from '@libp2p/crypto';
import {peerIdFromKeys} from '@libp2p/peer-id';

async function generateAndSaveKeys(type, path = process.env.KEYS_DIRECTORY) {
    try {
        if (fs.existsSync(path)) {
            throw new Error(`Directory ${path} already exists.`);
        }

        fs.mkdirSync(path);

        const keySize = type === 'RSA' ? 2048 : undefined; 
        const keyPair = await keys.generateKeyPair(type, keySize);

        const privateKeyBytes = await keyPair.bytes;
        const publicKeyBytes = await keyPair.public.bytes;

        fs.writeFileSync(`${path}private.key`, privateKeyBytes);
        fs.writeFileSync(`${path}public.key`, publicKeyBytes);

        console.log(`Keys generated and saved successfully in ${path}`);
    } catch (error) {
        console.error('Error generating keys:', error);
    }
}


async function loadPeerIdFromKeys(path = process.env.KEYS_DIRECTORY) {
    const privateKeyBytes = fs.readFileSync(`${path}private.key`);
    const publicKeyBytes = fs.readFileSync(`${path}public.key`);
  
    return peerIdFromKeys(publicKeyBytes, privateKeyBytes);
}


await generateAndSaveKeys('Ed25519', './keys/');
const peerId = await loadPeerIdFromKeys();
console.log({peerId})
