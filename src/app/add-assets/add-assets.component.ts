import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Define interfaces (unchanged)
interface Asset {
  assetName: string;
  cost: number;
  categoryId: number;
  assetHistory: string;
  locationId: number;
  year: string;
  employeeId: number;
  supplierId: number;
  description: string; // Optional description field
}

interface Category {
  categoryId: number;
  categoryName: string;
}

interface Location {
  locationId: number;
  locationName: string;
}

interface Employee {
  employeeId: number;
  employeeName: string;
}

interface Supplier {
  supplierId: number;
  supplierName: string;
}

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-assets.component.html',
  styleUrls: ['./add-assets.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule],
  standalone: true
})
export class AddAssetsComponent implements OnInit {
  private addAssetUrl = 'http://localhost:8080/api/v1/assets/add';
  private categoriesUrl = 'http://localhost:8080/api/v1/categories/list';
  private locationsUrl = 'http://localhost:8080/api/v1/locations/list';
  private employeesUrl = 'http://localhost:8080/api/v1/employees/list';
  private suppliersUrl = 'http://localhost:8080/api/v1/suppliers/list';

  asset: Asset = {
    assetName: '',
    cost: 0,
    categoryId: 0,
    assetHistory: '',
    locationId: 0,
    year: new Date().getFullYear().toString(),
    employeeId: 0,
    supplierId: 0,
    description: ''
  };
  categories: Category[] = [];
  locations: Location[] = [];
  employees: Employee[] = [];
  suppliers: Supplier[] = [];
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadDropdownData();
  }

  loadDropdownData() {
    // ... (unchanged loadDropdownData method)
    this.loading = true;

    this.http.get<Category[]>(this.categoriesUrl).subscribe({
      next: (result) => {
        this.categories = result;
        this.asset.categoryId = result.length > 0 ? result[0].categoryId : 0;
      },
      error: (error) => console.error('Error fetching categories:', error)
    });

    this.http.get<Location[]>(this.locationsUrl).subscribe({
      next: (result) => {
        this.locations = result;
        this.asset.locationId = result.length > 0 ? result[0].locationId : 0;
      },
      error: (error) => console.error('Error fetching locations:', error)
    });

    this.http.get<Employee[]>(this.employeesUrl).subscribe({
      next: (result) => {
        this.employees = result;
        this.asset.employeeId = result.length > 0 ? result[0].employeeId : 0;
      },
      error: (error) => console.error('Error fetching employees:', error)
    });

    this.http.get<Supplier[]>(this.suppliersUrl).subscribe({
      next: (result) => {
        this.suppliers = result;
        this.asset.supplierId = result.length > 0 ? result[0].supplierId : 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching suppliers:', error);
        this.loading = false;
      }
    });
  }

  onSubmit() {
    // Check if any required field is empty or invalid
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post(this.addAssetUrl, this.asset, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response;
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to add asset. Please try again.';
        console.error('Error adding asset', error);
      }
    });
  }

  // Validation method
  private isFormValid(): boolean {
    return (
      this.asset.assetName.trim() !== '' &&
      this.asset.cost > 0 &&
      this.asset.categoryId > 0 && // tbd
      this.asset.description.trim() !== '' &&
      this.asset.assetHistory.trim() !== '' &&
      this.asset.locationId > 0 &&
      this.asset.year.trim() !== '' &&
      this.asset.employeeId > 0 &&
      this.asset.supplierId > 0  // tbd
    );
  }

  // Reset form method
  private resetForm(): void {
    this.asset = {
      assetName: '',
      cost: 0,
      categoryId: this.categories.length > 0 ? this.categories[0].categoryId : 0,
      assetHistory: '',
      locationId: this.locations.length > 0 ? this.locations[0].locationId : 0,
      year: new Date().getFullYear().toString(),
      employeeId: this.employees.length > 0 ? this.employees[0].employeeId : 0,
      supplierId: this.suppliers.length > 0 ? this.suppliers[0].supplierId : 0,
      description: ''
    };
  }
}