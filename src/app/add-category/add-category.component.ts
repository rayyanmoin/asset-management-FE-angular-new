import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Define the Category interface
interface Category {
  categoryName: string;
  categoryCode: string;
  categoryDescription: string;
}

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule],
  standalone: true
})
export class AddCategoryComponent {
  private addApiUrl = 'http://localhost:8080/api/v1/categories/add';
  private updateApiUrl = 'http://localhost:8080/api/v1/categories/update';

  category: Category = {
    categoryName: '',
    categoryCode: '',
    categoryDescription: ''
  };
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  editMode: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['category']) {
      this.category = navigation.extras.state?.['category'];
      this.editMode = true; // Set edit mode to true if category data is passed
    }
  }

  onSubmit() {
    // Check if form is valid before submitting
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.editMode) {
      this.updateCategory(); // Call update function if edit mode is enabled
    } else {
      this.addCategory(); // Otherwise, call add function
    }
  }

  // Function to call the add API
  private addCategory() {
    this.http.post(this.addApiUrl, this.category, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response;
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to add category. Please try again.';
        console.error('Error adding category', error);
      }
    });
  }

  // Function to call the edit API
  private updateCategory() {
    this.http.put(this.updateApiUrl, this.category, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Category updated successfully!';
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to update category. Please try again.';
        console.error('Error updating category', error);
      }
    });
  }

  // Validation method
  private isFormValid(): boolean {
    return (
      this.category.categoryName.trim() !== '' &&
      this.category.categoryDescription.trim() !== '' &&
      this.category.categoryCode.trim() !== ''
    );
  }

  // Reset form method
  private resetForm(): void {
    this.category = {
      categoryName: '',
      categoryCode: '',
      categoryDescription: ''
    };
    this.editMode = false;
  }
}
