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
 * 新たな`Contract`インスタンスを作成し、スマートコントラクトとの対話に使えるようにする。
 * @param privateKey(秘密鍵)はコントラクトに送信されたトランザクションに署名するために使われる。
 * @param publicKey(公開鍵)は秘密鍵に対応するものである。
 * @returns `Contract`のインスタンス
 */
export async function getContract(currentUserAddress, privateKey, publicKey) {
  const client = new Client(
    'default',
    'ws://127.0.0.1:46657/websocket',
    'ws://127.0.0.1:9999/queryws'
  );

  const web3 = new Web3(new LoomProvider(client, privateKey));
  const networkId = await web3.eth.net.getId();
  const currentNetwork = Matching.networks[networkId];
  const ABI = Matching.abi;

  return new web3.eth.Contract(ABI, currentNetwork.address, {
    from: currentUserAddress
  });
}

/**
 * スマートコントラクト内のキーとバリューの連想配列を格納
 * @param contract コントラクトのインスタンスが`getContract()`から返す
 */
export async function like(address, contract, key: string) {
  await contract.methods.like(1).send({
    from: address
  });
}

/**
 * スマートコントラクト内にあるキーと結び付けられたバリューをロードする。
 * @param contract コントラクトのインスタンスが`getContract()`から返す
 */
export async function disLike(address, contract, key: string) {
  await contract.methods.like(1).send({
    from: address
  });
}
