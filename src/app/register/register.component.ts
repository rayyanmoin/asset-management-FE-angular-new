import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface User {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule],
  standalone: true
})
export class RegisterComponent {
  private apiUrl = 'http://localhost:8080/auth/register';

  user: User = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  };
  roles: string[] = ['USER', 'ADMIN'];
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // Password validation regex
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  // Email validation regex
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(private http: HttpClient) { }

  onSubmit() {
    // Check if passwords match
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Check if password meets requirements
    if (!this.passwordPattern.test(this.user.password)) {
      this.errorMessage = 'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters';
      return;
    }

    // Check if email is valid
    if (!this.emailPattern.test(this.user.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Remove confirmPassword before sending to API
    const userData = {
      username: this.user.username,
      email: this.user.email,
      password: this.user.password,
      role: this.user.role
    };

    this.http.post(this.apiUrl, userData, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response;
        this.user = {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'USER'
        };
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to register user. Please try again.';
        console.error('Error registering user', error);
      }
    });
  }
}