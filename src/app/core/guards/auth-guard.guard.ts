import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = (route, state) => {
    var auth = inject(AuthService)
    var routee = inject(Router)
    
    if (auth.isLoggedIn()) return true;

    routee.navigate(['/login']);
    return false;
};
