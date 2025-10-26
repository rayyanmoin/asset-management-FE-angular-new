import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Define interfaces
interface Employee {
  id?: number; // Added ID for updating existing employees
  employeeName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  locationId: number;
}

interface Location {
  locationId: number;
  locationName: string;
}

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule],
  standalone: true
})
export class AddEmployeeComponent implements OnInit {
  private addEmployeeUrl = 'http://localhost:8080/api/v1/employees/add';
  private updateEmployeeUrl = 'http://localhost:8080/api/v1/employees/update';
  private locationsUrl = 'http://localhost:8080/api/v1/locations';

  employee: Employee = {
    employeeName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    locationId: 0
  };
  locations: Location[] = [];
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  editMode: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['employee']) {
      this.employee = navigation.extras.state?.['employee'];
      this.editMode = true; // Set edit mode to true if employee data is passed
    }
  }

  ngOnInit(): void {
    this.getLocations();
  }

  getLocations() {
    this.loading = true;
    this.http.get<Location[]>(this.locationsUrl).subscribe({
      next: (result: Location[]) => {
        this.locations = result;
        if (!this.editMode && result.length > 0) {
          this.employee.locationId = result[0].locationId;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching locations:', error);
        this.errorMessage = 'Failed to load locations.';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.editMode) {
      this.updateEmployee();
    } else {
      this.addEmployee();
    }
  }

  // Add new employee
  private addEmployee() {
    this.http.post(this.addEmployeeUrl, this.employee, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response;
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to add employee. Please try again.';
        console.error('Error adding employee', error);
      }
    });
  }

  // Update existing employee
  private updateEmployee() {
    this.http.put(this.updateEmployeeUrl, this.employee, { responseType: 'text' }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Employee updated successfully!';
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to update employee. Please try again.';
        console.error('Error updating employee', error);
      }
    });
  }

  // Validation method
  private isFormValid(): boolean {
    return (
      this.employee.employeeName.trim() !== '' &&
      this.employee.contactEmail.trim() !== '' &&
      this.employee.contactPhone.trim() !== '' &&
      this.employee.address.trim() !== '' &&
      this.employee.locationId > 0
    );
  }

  // Reset form method
  private resetForm(): void {
    this.employee = {
      employeeName: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      locationId: this.locations.length > 0 ? this.locations[0].locationId : 0
    };
    this.editMode = false;
  }

  // Cancel edit mode
  cancelEdit() {
    this.resetForm();
    this.successMessage = '';
    this.errorMessage = '';
  }
}
