import { Component, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { CryptoUtils } from 'loom-js';
import {
  StackConfig,
  Stack,
  Card,
  ThrowEvent,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent,
} from 'angular2-swing';

import { getUserAddress, getContract, like, disLike } from '../loom-network/transaction';

interface CardItem {
  key: number;
  title: string;
}

type Action = 'like' | 'dislike';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('mySwing') swingStack: SwingStackComponent;
  @ViewChildren('myCards') swingCards: QueryList<SwingCardComponent>;

  cards: CardItem[] = [
    { key: 1, title: 'Card 1' },
    { key: 2, title: 'Card 2' },
    { key: 3, title: 'Card 3' },
    { key: 4, title: 'Card 4' },
    { key: 5, title: 'Card 5' },
    { key: 1, title: 'Card 1' },
    { key: 2, title: 'Card 2' },
    { key: 3, title: 'Card 3' },
    { key: 4, title: 'Card 4' },
    { key: 5, title: 'Card 5' },
    { key: 1, title: 'Card 1' },
    { key: 2, title: 'Card 2' },
    { key: 3, title: 'Card 3' },
    { key: 4, title: 'Card 4' },
    { key: 5, title: 'Card 5' },
    { key: 1, title: 'Card 1' },
    { key: 2, title: 'Card 2' },
    { key: 3, title: 'Card 3' },
    { key: 4, title: 'Card 4' },
    { key: 5, title: 'Card 5' },
    { key: 1, title: 'Card 1' },
    { key: 2, title: 'Card 2' },
    { key: 3, title: 'Card 3' },
    { key: 4, title: 'Card 4' },
    { key: 5, title: 'Card 5' },
  ].reverse();

  stackConfig = {
    throwOutConfidence: (offset: number, targetElement: HTMLElement) => {
      // you would put ur logic based on offset & targetelement to determine
      // what is your throwout confidence
      return 1;
    },
    minThrowOutDistance: 700    // default value is 400
  };

  constructor() {}

  ngAfterViewInit() {
    // ViewChild & ViewChildren are only available
    // in this function

    // we can get the underlying stack
    // which has methods - createCard, destroyCard, getCard etc
    // console.log(this.swingStack.stack);

    // and the cards
    // every card has methods - destroy, throwIn, throwOut etc
    // this.swingCards.forEach((c) => console.log(c.getCard()));

    // this is how you can manually hook up to the
    // events instead of providing the event method in the template
    // this.swingStack.throwoutleft.subscribe(
    //   (event: ThrowEvent) => console.log('Manual hook: ', event));

    // this.swingStack.dragstart.subscribe((event: DragEvent) => console.log(event));
    // this.swingStack.dragmove.subscribe((event: DragEvent) => console.log(event));
  }

  onClickLike(card: CardItem) {
    console.log('❤️', card);
    this.sendTransaction(card, 'like');
  }

  onClickDisLike(card: CardItem) {
    console.log('🙅‍♂️', card);
    this.sendTransaction(card, 'dislike');
  }

  onThrowoutLeft(event: ThrowEvent) {
    console.log('left throw out', event);
    const index = +event.target.className - 1;
    this.sendTransaction(this.cards[index], 'dislike');
  }

  onThrowoutRight(event: ThrowEvent) {
    console.log('right throw out', event);
    const index = +event.target.className - 1;
    this.sendTransaction(this.cards[index], 'like');
  }

  private async sendTransaction(card: CardItem, action: Action): Promise<void> {
    const privateKey = CryptoUtils.generatePrivateKey();
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);

    const address = await getUserAddress(publicKey);
    const contract = await getContract(address, privateKey, publicKey);
    if (action === 'like') {
      await like(address, contract, card.key);
    } else {
      await disLike(address, contract, card.key);
    }
  }
}
