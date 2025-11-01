import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import countriesData from './countries-data.json';

interface Supplier {
  id?: number;
  supplierName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  registrationNo: string;
  country: string;
  city: string;
  status: string;
}

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule],
  standalone: true
})
export class AddSupplierComponent {
  private addApiUrl = 'http://localhost:8080/api/v1/suppliers/add';
  private updateApiUrl = 'http://localhost:8080/api/v1/suppliers/update';

  supplier: Supplier = {
    supplierName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    registrationNo: '',
    country: '',
    city: '',
    status: ''
  };

  loading = false;
  successMessage = '';
  errorMessage = '';
  editMode = false;

  countries: string[] = [];
  citiesByCountry: { [key: string]: string[] } = {};
  filteredCities: string[] = [];

  constructor(private http: HttpClient, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['supplier']) {
      this.supplier = navigation.extras.state['supplier'];
      this.editMode = true;
    }

    // ✅ Load country/city data directly from JSON import
    this.countries = countriesData.countries;
    this.citiesByCountry = countriesData.citiesByCountry;

    // ✅ Pre-fill cities when editing
    if (this.editMode && this.supplier.country) {
      this.onCountryChange();
    }
  }

  onCountryChange() {
    const selectedCountry = this.supplier.country;
    this.filteredCities = this.citiesByCountry[selectedCountry] || [];
    // Keep the selected city if valid; otherwise reset it
    if (!this.filteredCities.includes(this.supplier.city)) {
      this.supplier.city = '';
    }
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
      this.updateSupplier();
    } else {
      this.addSupplier();
    }
  }

  private addSupplier() {
    this.http.post(this.addApiUrl, this.supplier, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response;
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to add supplier. Please try again.';
        console.error('Error adding supplier', error);
      }
    });
  }

  private updateSupplier() {
    this.http.put(this.updateApiUrl, this.supplier, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Supplier updated successfully!';
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to update supplier. Please try again.';
        console.error('Error updating supplier', error);
      }
    });
  }

  private isFormValid(): boolean {
    return (
      this.supplier.supplierName.trim() !== '' &&
      this.supplier.contactName.trim() !== '' &&
      this.supplier.contactEmail.trim() !== '' &&
      this.supplier.contactPhone.trim() !== '' &&
      this.supplier.address.trim() !== '' &&
      this.supplier.registrationNo.trim() !== '' &&
      this.supplier.country.trim() !== '' &&
      this.supplier.city.trim() !== '' &&
      this.supplier.status.trim() !== ''
    );
  }

  private resetForm(): void {
    this.supplier = {
      supplierName: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      registrationNo: '',
      country: '',
      city: '',
      status: ''
    };
    this.filteredCities = [];
    this.editMode = false;
  }

  cancelEdit() {
    this.resetForm();
    this.successMessage = '';
    this.errorMessage = '';
  }
}
