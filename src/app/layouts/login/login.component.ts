import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ['']
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
    this.authService.login(emailAddress,password).pipe(this.toast.observe({
      success: 'Logged In Successfully.',loading: 'Currently Logging In...', error: 'An error occurred.'})).subscribe(() => {
    this.router.navigate(['/home']);
  });
  }
  

}