// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private router: Router) {
    // Check initial auth state on service initialization
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    this.isAuthenticatedSubject.next(!!token);
    this.userRoleSubject.next(role);
  }

  login(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    this.isAuthenticatedSubject.next(true);
    this.userRoleSubject.next(role);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isAuthenticatedSubject.next(false);
    this.userRoleSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return this.userRoleSubject.value;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isUser(): boolean {
    return this.getUserRole() === 'USER';
  }
}