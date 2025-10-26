// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service'; // Adjust the path as needed

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Get the required roles from route data (optional)
    const requiredRoles = route.data['roles'] as string[] | undefined;

    // If no roles are specified, allow access if authenticated
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Check if the user's role matches any of the required roles
    const userRole = this.authService.getUserRole();
    if (userRole && requiredRoles.includes(userRole)) {
      return true; // Allow access if role matches
    }

    // Redirect to an unauthorized page or home if role doesn't match
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}