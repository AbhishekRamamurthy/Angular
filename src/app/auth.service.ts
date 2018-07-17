import { Injectable,OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { ActivatedRoute, Router } from '@angular/router';
import {switchMap} from 'rxjs/operators';

import { UserService } from './user.service';
import { AppUser } from './models/app-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth, private route: ActivatedRoute, 
              private router: Router, private userService: UserService) { 
    this.user$ = afAuth.authState;
  }


  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl',returnUrl);
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(result => {
      if(result.user) {
        this.router.navigateByUrl(localStorage.getItem('returnUrl'));
        this.userService.save(result.user);
      }
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  get appUser$(): Observable<AppUser> {
    return this.user$.pipe(
      switchMap( user => {
        if(user)
          return this.userService.get(user.uid).valueChanges();
        return of(null);
      })
    )
  }
  
}
