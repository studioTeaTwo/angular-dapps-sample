import {
  NonceTxMiddleware, SignedTxMiddleware, Client,
  Contract, Address, LocalAddress, LoomProvider
} from 'loom-js';

import { MapEntry } from './protobuf-extend';
import Web3 from 'web3';

declare const require;
const Matching = require('../../../build/contracts/Matching.json');


export async function getUserAddress(publicKey) {
  return LocalAddress.fromPublicKey(publicKey).toString();
}
/**
 *
 */
export async function getContract(currentUserAddress, privateKey, publicKey) {
  const client = new Client(
    'default',
    'ws://127.0.0.1:46657/websocket',
    'ws://127.0.0.1:9999/queryws'
  );

  const web3 = new Web3(new LoomProvider(client, privateKey) as any);
  const networkId = await web3.eth.net.getId();
  const currentNetwork = Matching.networks[networkId];
  const ABI = Matching.abi;

  return new web3.eth.Contract(ABI, currentNetwork.address, {
    from: currentUserAddress
  });
}

/**
 *
 */
export async function like(address, contract, key: number) {
  await contract.methods.like(key).send({
    from: address
  });
}

/**
 *
 */
export async function disLike(address, contract, key: number) {
  await contract.methods.disLike(key).send({
    from: address
  });
}
