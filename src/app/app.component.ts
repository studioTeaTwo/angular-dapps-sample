import { Component } from '@angular/core';
import {
  NonceTxMiddleware, SignedTxMiddleware, Client,
  Contract, Address, LocalAddress, CryptoUtils
} from 'loom-js';

import { MapEntry } from './helloworld';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor() {
    this.initializeBC();
  }

  private async initializeBC () {
    const privateKey = CryptoUtils.generatePrivateKey();
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);

    const contract = await this.getContract(privateKey, publicKey);
    await this.store(contract, '123', 'hello!');
    const value = await this.load(contract, '123');
    console.log('Value: ' + value);
  }

  /**
   * 新たな`Contract`インスタンスを作成し、スマートコントラクトとの対話に使えるようにする。
   * @param privateKey(秘密鍵)はコントラクトに送信されたトランザクションに署名するために使われる。
   * @param publicKey(公開鍵)は秘密鍵に対応するものである。
   * @returns `Contract`のインスタンス
   */
  private async getContract(privateKey, publicKey) {
    const client = new Client(
      'default',
      'ws://127.0.0.1:46657/websocket',
      'ws://127.0.0.1:9999/queryws'
    );
    // ミドルウェアを要求
    client.txMiddleware = [
      new NonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ];
    const contractAddr = await client.getContractAddressAsync('BluePrint');
    const callerAddr = new Address(client.chainId, LocalAddress.fromPublicKey(publicKey));
    return new Contract({
      contractAddr,
      callerAddr,
      client
    });
  }

  /**
   * スマートコントラクト内のキーとバリューの連想配列を格納
   * @param contract コントラクトのインスタンスが`getContract()`から返す
   */
  private async store(contract, key, value) {
    const params = new MapEntry();
    params.setKey(key);
    params.setValue(value);
    await contract.callAsync('SetMsg', params);
  }

  /**
   * スマートコントラクト内にあるキーと結び付けられたバリューをロードする。
   * @param contract コントラクトのインスタンスが`getContract()`から返す
   */
  private async load(contract, key) {
    const params = new MapEntry();
    // The smart contract will look up the value stored under this key.
    params.setKey(key);
    const result = await contract.staticCallAsync('GetMsg', params, new MapEntry());
    return result.getValue();
  }

}
