import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppUser } from '../models/app-user';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnInit{

  appUser: AppUser;
  shoppigCartItemCount: number;

  constructor(private auth: AuthService, private shoppingCartService: ShoppingCartService) { 
    auth.appUser$.subscribe(appUser=> {
      this.appUser = appUser
    });
  }

  logout() {
    this.auth.logout();
  }

  async ngOnInit() {
    let cart$= await this.shoppingCartService.getCart();
    cart$.valueChanges().subscribe(cart => {
      this.shoppigCartItemCount = 0;
      for(let productId in cart.items) {
        this.shoppigCartItemCount += cart.items[productId].quantity;
      }
    });
  }

}
