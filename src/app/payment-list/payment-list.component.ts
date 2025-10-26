// supplier-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

// Define the Payment interface
interface Payment {
  paymentId: number;
  assetName: string;
  supplierName: string;
  chequeNumber: string;
  paymentDate: string;
  amount: number;
  amountToReturn: number;
}

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css'],
  imports: [CommonModule, HttpClientModule], // Add HttpClientModule for HTTP requests
  standalone: true
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];
  loading: boolean = true;
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getAllPayments();
  }

  getAllPayments() {
    this.loading = true;
    this.http.get<Payment[]>("http://localhost:8080/api/v1/payment/list").subscribe({
      next: (result: Payment[]) => {
        this.payments = result;
        console.log('Payments loaded:', this.payments);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching payments:', error);
        this.loading = false;
      }
    });
  }

}