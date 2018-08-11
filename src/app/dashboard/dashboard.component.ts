import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { CryptoUtils } from 'loom-js';

import { getUserAddress, getContract, like, disLike } from '../loom-network/transaction';

interface Card {
  key: number;
  title: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  get card() {
    return this._card;
  }
  set card(i) {
    this._card = this.cards[i] == null ? this.cards[0] : this.cards[i];
  }
  private _card;

  private cards = [
    { key: 1, title: 'Card 1' },
    { key: 2, title: 'Card 2' },
    { key: 3, title: 'Card 3' },
    { key: 4, title: 'Card 4' },
    { key: 5, title: 'Card 5' },
  ];

  constructor(private breakpointObserver: BreakpointObserver) {
    this.card = 0;
  }

  onClickLike(card: Card) {
    console.log('❤️', card);
    this.sendTransaction(card);
    this.card = card.key;
  }

  onClickDisLike(card: Card) {
    console.log('🙅‍♂️', card);
    this.card = card.key;
  }

  private async sendTransaction(card: Card) {
    const privateKey = CryptoUtils.generatePrivateKey();
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);

    const address = await getUserAddress(publicKey);
    const contract = await getContract(address, privateKey, publicKey);
    await like(address, contract, "1");
  }
}
