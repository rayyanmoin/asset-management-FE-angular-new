// asset-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Define nested interfaces
interface CategoryDetails {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
}

interface AssetDetailsNested {
  assetId: number;
  assetName: string;
  categoryId: number;
  categoryDetails: CategoryDetails;
  cost: number;
}

interface LocationDetails {
  locationId: number;
  locationName: string;
  locationCode: string;
}

interface EmployeeDetails {
  employeeId: number;
  employeeName: string;
  locationId: number;
  locationDetails: LocationDetails;
  contactEmail: string;
  contactPhone: string;
}

interface SupplierDetails {
  supplierId: number;
  supplierName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

// Main interface for the API response
interface AssetDetails {
  assetDetailsId: number;
  assetId: number;
  assetDetails: AssetDetailsNested;
  employeeId: number;
  employeeDetails: EmployeeDetails;
  locationId: number;
  locationDetails: LocationDetails;
  supplierId: number;
  supplierDetails: SupplierDetails;
}

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.css'],
  imports: [CommonModule, HttpClientModule, RouterModule],
  standalone: true
})
export class AssetDetailsComponent implements OnInit {
  assets: AssetDetails[] = [];
  loading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllAssetDetails();
  }

  getAllAssetDetails() {
    this.loading = true;
    this.http.get<AssetDetails[]>("http://localhost:8080/api/v1/assetDetails").subscribe({
      next: (result: AssetDetails[]) => {
        this.assets = result;
        console.log('Asset details loaded:', this.assets);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching asset details:', error);
        this.loading = false;
      }
    });
  }

  editAsset(asset: AssetDetails): void {
    console.log('Edit asset:', asset);
    // Implement edit functionality
  }

  isUser(): boolean {
    // Example logic: return true if role is 'USER', false if 'ADMIN'
    const role = localStorage.getItem('role'); // Or however you store user role
    return role === 'USER';
  }
}