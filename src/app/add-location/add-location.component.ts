import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import countriesData from './../add-supplier/countries-data.json';

// Define the Location interface
interface Location {
  locationName: string;
  locationCode: string;
  country: string;
  city: string;
  locationDescription: string;
}


@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule],
  standalone: true
})
export class AddLocationComponent {
  private addApiUrl = 'http://localhost:8080/api/v1/locations/add';
  private updateApiUrl = 'http://localhost:8080/api/v1/locations/update';

  location: Location = {
    locationName: '',
    locationCode: '',
    country: '',
    city: '',
    locationDescription: ''
  };
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  editMode: boolean = false;

  countries: string[] = [];
  citiesByCountry: { [key: string]: string[] } = {};
  filteredCities: string[] = [];

  constructor(private http: HttpClient, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['location']) {
      this.location = navigation.extras.state['location'];
      this.editMode = true; // Set edit mode if location data exists
    }
       // ✅ Load country/city data directly from JSON import
    this.countries = countriesData.countries;
    this.citiesByCountry = countriesData.citiesByCountry;

    // ✅ Pre-fill cities when editing
    if (this.editMode && this.location.country) {
      this.onCountryChange();
    }
  }

  onCountryChange() {
    const selectedCountry = this.location.country;
    this.filteredCities = this.citiesByCountry[selectedCountry] || [];
    // Keep the selected city if valid; otherwise reset it
    if (!this.filteredCities.includes(this.location.city)) {
      this.location.city = '';
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
      this.updateLocation();
    } else {
      this.addLocation();
    }
  }

  private addLocation() {
    this.http.post(this.addApiUrl, this.location, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Location added successfully!';
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to add location. Please try again.';
        console.error('Error adding location', error);
      }
    });
  }

  private updateLocation() {
    this.http.put(this.updateApiUrl, this.location, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Location updated successfully!';
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to update location. Please try again.';
        console.error('Error updating location', error);
      }
    });
  }

  cancelEdit() {
    this.resetForm();
  }

  private isFormValid(): boolean {
    return (
      this.location.locationName.trim() !== '' &&
      this.location.locationCode.trim() !== '' &&
      this.location.locationDescription.trim() !== ''
    );
  }

  private resetForm(): void {
    this.location = {
      locationName: '',
      locationCode: '',
      country: '',
      city: '',
      locationDescription: ''
    };
    this.editMode = false;
  }
}
