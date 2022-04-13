import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
        *{
          background: #fff;
        }
        .wrapper{ width: 100vw; height: 100vh; display: flex; justify-content: center; align-content: center;}
        .loginContainer{
          margin: 20vh 25vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 10px;
          background: #fff !important;
          overflow: hidden;
        }
        #account-icon{
          position: relative;
          right:  -45%;
          font-size: 92px;
          color: #000;
        }
        mat-form-field{
          margin-bottom: 25px; background: #C1D0ED;
          padding: 10px;
        }
        
        .formIcon{
          margin-top: 5px;
          margin-right: 5px;
          vertical-align: bottom;
        }
        
        #login-button{
          margin: 0 47%;
        }

        button{
          color: #000;
          background: #60BBEE;
        }
  `]
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private authService: AuthenticationService, private router: Router, private toast: HotToastService) { }

  ngOnInit(): void {
  }

  getEmailAddress(){
    return this.loginForm.get('emailAddress')
  }

  getPassword(){
    return this.loginForm.get('password')
  }

  submit(){
    if(!this.loginForm.valid){
      return;
    }
    const {emailAddress, password} = this.loginForm.value;
    this.authService.login(emailAddress,password).pipe(
      this.toast.observe({
        success: 'authenticated as ' + emailAddress + '...',//'Logged In Successfully.',
        loading: 'Currently Logging In...', 
        error: 'An error occurred.'})
    ).subscribe(( user) => {
      if ( user ){
        console.log(user)
        this.router.navigate(['views']);
      }
    });
  }
  

}