// employee-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service'; // Import AuthService

// Define the LocationDetails interface
interface LocationDetails {
  locationId: number;
  locationName: string;
  locationCode: string;
}

// Define the Employee interface
interface Employee {
  employeeId: number;
  employeeName: string;
  locationId: number;
  locationDetails: LocationDetails;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  imports: [CommonModule, HttpClientModule],
  standalone: true
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  loading: boolean = true;
  userRole: string | null = null;
  private roleSubscription!: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAllEmployees();

    // Subscribe to role changes from AuthService
    this.roleSubscription = this.authService.userRole$.subscribe(
      (role) => {
        this.userRole = role;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  getAllEmployees() {
    this.loading = true;
    this.http.get<Employee[]>("http://localhost:8080/api/v1/employees").subscribe({
      next: (result: Employee[]) => {
        this.employees = result;
        console.log('Employees loaded:', this.employees);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        this.loading = false;
      }
    });
  }

  editEmployee(employee: Employee): void {
    if (this.isAdmin()) {
      console.log('Edit employee:', employee);
      this.router.navigate(['/addEmployee'], {
        state: { employee }
      });
    } else {
      alert('You do not have permission to edit employees.');
    }
  }

  // Role-based helper methods
  isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  isUser(): boolean {
    return this.userRole === 'USER';
  }
}
