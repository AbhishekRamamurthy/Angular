import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cart: ShoppingCart;
  keys;
  shoppigCartItemCount: number;
  price: number;
  totalPrice: number;
  subscription: Subscription;

  constructor(private shoppingCartService: ShoppingCartService) { }

  async ngOnInit() {
    let cart$ = await this.shoppingCartService.getCart();
    this.subscription = cart$.valueChanges().subscribe(cart => {
      this.shoppigCartItemCount = 0;
      this.totalPrice = 0;
      for(let productId in cart.items) {
        this.shoppigCartItemCount += cart.items[productId].quantity;
        this.totalPrice = this.totalPrice + (cart.items[productId].product.price * cart.items[productId].quantity);
      }
      this.cart = cart;
      this.keys = Object.keys(cart.items);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
