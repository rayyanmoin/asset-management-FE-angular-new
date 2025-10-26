import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Define interfaces (unchanged)
interface Payment {
  assetId: number;
  supplierId: number;
  paymentMode: string;
  chequeNumber: string;
  paymentDate: string;
  amount: number;
  amountToReturn: number;
}

interface Asset {
  assetId: number;
  assetName: string;
}

interface Supplier {
  supplierId: number;
  supplierName: string;
}

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule],
  standalone: true,
})
export class AddPaymentComponent implements OnInit {
  private addPaymentUrl = 'http://localhost:8080/api/v1/payment/add';
  private assetsUrl = 'http://localhost:8080/api/v1/assetDrop';
  private suppliersUrl = 'http://localhost:8080/api/v1/suppliers/dropList';

  payment: Payment = {
  assetId: 0,
  supplierId: 0,
  paymentMode: "",
  chequeNumber: "",
  paymentDate: "",
  amount: 0,
  amountToReturn: 0,
  };
  asset: Asset[] = [];
  suppliers: Supplier[] = [];
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDropdownData();
  }

  loadDropdownData() {
    // ... (unchanged loadDropdownData method)
    this.loading = true;

    
    this.http.get<Asset[]>(this.assetsUrl).subscribe({
      next: (result) => {
        this.asset = result;
        this.payment.assetId = result.length > 0 ? result[0].assetId : 0;
      },
      error: (error) => console.error('Error fetching assets:', error),
    });

    this.http.get<Supplier[]>(this.suppliersUrl).subscribe({
      next: (result) => {
        this.suppliers = result;
        this.payment.supplierId = result.length > 0 ? result[0].supplierId : 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching suppliers:', error);
        this.loading = false;
      },
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

    this.http
      .post(this.addPaymentUrl, this.payment, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = response;
          this.resetForm();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to add payment. Please try again.';
          console.error('Error adding payment', error);
        },
      });
  }

  // Validation method
  private isFormValid(): boolean {
    return (
      this.payment.assetId > 0 &&
      this.payment.supplierId > 0 &&
      this.payment.paymentMode.trim() !== '' &&
      this.payment.paymentDate.trim() !== '' &&
      this.payment.amount > 0
    );
  }


  // Reset form method
  private resetForm(): void {
    this.payment = {
      assetId: this.asset.length > 0 ? this.asset[0].assetId : 0,
      supplierId: this.suppliers.length > 0 ? this.suppliers[0].supplierId : 0,
      paymentMode: "",
      chequeNumber: "",
      paymentDate: "",
      amount: 0,
      amountToReturn: 0,
    };
  }
}