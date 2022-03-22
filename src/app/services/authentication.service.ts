import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
    
  //currentUser$ = authState(this.auth);
  currentUser= this.auth.currentUser ;
  loggedIn :boolean = this.auth.currentUser ? true : false ; 

  constructor(private auth: Auth) {
      this.auth.onAuthStateChanged( (user)=>{

        if( user){
            this.loggedIn = true
            this.currentUser = user
        }
        else{
            this.loggedIn = false;
        }
      });
   }

  signUp(name: string, email: string, password: string){
    // return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
    //   switchMap(({user}) =>  updateProfile(user, {displayName: name}))
      
    // );
    
     return createUserWithEmailAndPassword(this.auth, email, password)
     //.then( (userCredentials)=>{
    //   console.log(userCredentials.user.uid, userCredentials.user.email)
    //   return userCredentials
    // })
    
  }

  

  login(username: string, password: string){
    return from(signInWithEmailAndPassword(this.auth, username, password));
  }

  logout(){
    return from(this.auth.signOut());
  }
  // passwordReset(){
  //   this.auth.
  // }
}