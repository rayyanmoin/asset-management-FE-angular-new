import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

// Define the Login interface
interface LoginCredentials {
  username: string;
  password: string;
}

// Define the expected response interface
interface LoginResponse {
  token: string;
  role: string; // Add role to the response
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule],
  standalone: true
})
export class LoginComponent {
  private apiUrl = 'http://localhost:8080/auth/login';

  credentials: LoginCredentials = {
    username: '',
    password: ''
  };
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  onSubmit() {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post<LoginResponse>(this.apiUrl, this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Login successful!';
        this.credentials = {
          username: '',
          password: ''
        };
        // Pass both token and role to AuthService
        this.authService.login(response.token, response.role);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Login failed. Please check your credentials.';
        console.error('Error during login', error);
      }
    });
  }
}