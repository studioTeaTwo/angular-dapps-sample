import { Component } from '@angular/core';
import { CryptoUtils } from 'loom-js';

import { getContract, store, load } from './loom-network/transaction';

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

    const contract = await getContract(privateKey, publicKey);
    await store(contract, '123', 'hello!');
    const value = await load(contract, '123');
    console.log('Value: ' + value);
  }
}
