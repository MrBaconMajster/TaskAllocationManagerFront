import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppServices } from './app.service';



@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private appService: AppServices
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        const user = JSON.parse(localStorage.getItem('user'));
    
        // if (!user && !user.name) {
        //     this.router.navigate(['/login']);
        //     return false;
        // }    
        return true;
    }
}