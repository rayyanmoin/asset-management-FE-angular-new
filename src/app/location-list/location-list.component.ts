// location-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service'; // Import AuthService

// Define the Location interface
interface Location {
  locationId: number;
  locationName: string;
  locationCode: string;
  country: string;
  city: string;
  locationDescription: string;
}

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.css'],
  imports: [CommonModule, HttpClientModule],
  standalone: true
})
export class LocationListComponent implements OnInit, OnDestroy {
  locations: Location[] = [];
  loading: boolean = true;
  userRole: string | null = null;
  private roleSubscription!: Subscription;
  private apiUrl = 'http://localhost:8080/api/v1/locations';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getLocations();

    // Subscribe to role updates
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

  getLocations(): void {
    this.loading = true;
    this.http.get<Location[]>(this.apiUrl).subscribe({
      next: (result: Location[]) => {
        this.locations = result;
        console.log('Locations loaded:', this.locations);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching locations:', error);
        this.loading = false;
      }
    });
  }

  editLocation(location: Location): void {
    if (this.isAdmin()) {
      console.log('Editing location:', location);
      this.router.navigate(['/addLocation'], {
        state: { location }
      });
    } else {
      alert('You do not have permission to edit locations.');
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
