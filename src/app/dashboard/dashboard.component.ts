import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { CryptoUtils } from 'loom-js';

import { getUserAddress, getContract, like, disLike } from '../loom-network/transaction';

interface Card {
  key: number;
  title: string;
  cols: number;
  rows: number;
  price: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = [
    { key: 1, title: 'Card 1', cols: 1, rows: 2, price: 1 },
    { key: 2, title: 'Card 2', cols: 1, rows: 2, price: 1 },
    { key: 3, title: 'Card 3', cols: 1, rows: 2, price: 1 },
    { key: 4, title: 'Card 4', cols: 1, rows: 2, price: 1 }
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}

  onClickLike(card: Card) {
    console.log('❤️', card);
    this.sendTransaction(card);
  }

  onClickDisLike(card: Card) {
    console.log('🙅‍♂️', card);
  }

  private async sendTransaction(card: Card) {
    const privateKey = CryptoUtils.generatePrivateKey();
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);

    const address = await getUserAddress(publicKey);
    const contract = await getContract(address, privateKey, publicKey);
    await like(address, contract, "1");
  }
}
