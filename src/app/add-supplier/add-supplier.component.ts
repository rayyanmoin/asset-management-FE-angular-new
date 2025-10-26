import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Define the Supplier interface
interface Supplier {
  id?: number; // Added ID for updating existing suppliers
  supplierName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  registrationNo: string;
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
    status: ''
  };
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  editMode: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['supplier']) {
      this.supplier = navigation.extras.state?.['supplier'];
      this.editMode = true; // Set edit mode to true if supplier data is passed
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

  // Add new supplier
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

  // Update existing supplier
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

  // Validation method
  private isFormValid(): boolean {
    return (
      this.supplier.supplierName.trim() !== '' &&
      this.supplier.contactName.trim() !== '' &&
      this.supplier.contactEmail.trim() !== '' &&
      this.supplier.contactPhone.trim() !== '' &&
      this.supplier.address.trim() !== '' &&
      this.supplier.registrationNo.trim() !== '' &&
      this.supplier.status.trim() !== ''
    );
  }

  // Reset form method
  private resetForm(): void {
    this.supplier = {
      supplierName: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      registrationNo: '',
      status: ''
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
