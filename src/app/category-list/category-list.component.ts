// category-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service'; // Import AuthService

// Define the Category interface
interface Category {
  categoryId: number;
  categoryName: string;
  categoryCode: string;
  categoryDescription: string;
}

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  imports: [CommonModule, HttpClientModule],
  standalone: true
})
export class CategoryListComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  loading: boolean = true;
  userRole: string | null = null;
  private roleSubscription!: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();

    // Subscribe to user role updates
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

  getAllCategories(): void {
    this.loading = true;
    this.http.get<Category[]>("http://localhost:8080/api/v1/categories").subscribe({
      next: (result: Category[]) => {
        this.categories = result;
        console.log('Categories loaded:', this.categories);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.loading = false;
      }
    });
  }

  editCategory(category: Category): void {
    // Allow only admin to edit
    if (this.isAdmin()) {
      console.log('Editing category:', category);
      this.router.navigate(['/addCategory'], {
        state: { category }
      });
    } else {
      alert('You do not have permission to edit categories.');
    }
  }

  // Role checking methods
  isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  isUser(): boolean {
    return this.userRole === 'USER';
  }
}
