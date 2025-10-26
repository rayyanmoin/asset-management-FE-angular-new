// asset-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service'; // Import AuthService

interface CategoryDetails {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
}

interface Asset {
  assetId: number;
  assetName: string;
  description: string;
  categoryId: number;
  categoryDetails: CategoryDetails;
  cost: number;
}

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css'],
  imports: [CommonModule, HttpClientModule],
  standalone: true
})
export class AssetListComponent implements OnInit, OnDestroy {
  assets: Asset[] = [];
  userRole: string | null = null;
  private roleSubscription!: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAllAssets();

    // Subscribe to user role from AuthService
    this.roleSubscription = this.authService.userRole$.subscribe(
      (role) => (this.userRole = role)
    );
  }

  ngOnDestroy(): void {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  getAllAssets() {
    this.http.get<Asset[]>("http://localhost:8080/api/v1/assets").subscribe({
      next: (result: Asset[]) => {
        this.assets = result;
      },
      error: (error) => {
        console.error('Error fetching assets:', error);
      }
    });
  }

  editAsset(asset: Asset): void {
    if (this.isAdmin()) {
      console.log('Edit asset:', asset);
      this.router.navigate(['/addAssets'], {
        state: { asset }
      });
    } else {
      alert('You do not have permission to edit assets.');
    }
  }

  // Role helpers
  isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  isUser(): boolean {
    return this.userRole === 'USER';
  }
}
