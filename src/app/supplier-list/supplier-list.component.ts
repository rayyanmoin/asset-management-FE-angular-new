// supplier-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service'; // Import AuthService

// Define the Supplier interface
interface Supplier {
  supplierId: number;
  supplierName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  registrationNo: string;
  status: string;
}

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css'],
  imports: [CommonModule, HttpClientModule],
  standalone: true
})
export class SupplierListComponent implements OnInit, OnDestroy {
  suppliers: Supplier[] = [];
  loading: boolean = true;
  userRole: string | null = null;
  private roleSubscription!: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAllSuppliers();

    // Subscribe to role changes
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

  getAllSuppliers(): void {
    this.loading = true;
    this.http.get<Supplier[]>("http://localhost:8080/api/v1/suppliers").subscribe({
      next: (result: Supplier[]) => {
        this.suppliers = result;
        console.log('Suppliers loaded:', this.suppliers);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching suppliers:', error);
        this.loading = false;
      }
    });
  }

  editSupplier(supplier: Supplier): void {
    if (this.isAdmin()) {
      console.log('Editing supplier:', supplier);
      this.router.navigate(['/addSupplier'], {
        state: { supplier }
      });
    } else {
      alert('You do not have permission to edit suppliers.');
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
