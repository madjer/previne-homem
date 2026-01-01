import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private auth: Auth, private router: Router) {
    onAuthStateChanged(this.auth, user => {
      if (user) {
        this.router.navigateByUrl('/');
      }
    });
  }

  loginGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    return signOut(this.auth).then(() => this.router.navigateByUrl('/login'));
  }
}
