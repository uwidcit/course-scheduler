import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService} from './authentication.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthenticationService, private router: Router) {}

  async canActivate(): Promise<boolean> {

      //const user = await this.auth.getUser();
      const loggedIn = this.auth.loggedIn

      if (!loggedIn) {
          // navigate to login page
        this.router.navigateByUrl('/login')
        return false
      }

      return true;
  }
  
}