// app.routes.ts (or wherever your routes are defined)
import { Routes } from '@angular/router';
import { AssetListComponent } from './asset-list/asset-list.component';
import { HomeComponent } from './home/home.component';
import { AssetDetailsComponent } from './asset-details/asset-details.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AddAssetsComponent } from './add-assets/add-assets.component';
import { LocationListComponent } from './location-list/location-list.component';
import { AddLocationComponent } from './add-location/add-location.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard'; // Import the guard
import { PaymentListComponent } from './payment-list/payment-list.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard], // Protect this route
  },
  {
    path: 'assetsList',
    component: AssetListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'USER'] },
  },
  {
    path: 'assetDetails',
    component: AssetDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'USER'] },
  },
  {
    path: 'employeeList',
    component: EmployeeListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'USER'] },
  },
  {
    path: 'supplierList',
    component: SupplierListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'USER'] },
  },
  {
    path: 'categoryList',
    component: CategoryListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'USER'] },
  },
  {
    path: 'addCategory',
    component: AddCategoryComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'addSupplier',
    component: AddSupplierComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'addPayment',
    component: AddPaymentComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN','USER'] },
  },
  {
    path: 'addEmployee',
    component: AddEmployeeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'addAssets',
    component: AddAssetsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'locationList',
    component: LocationListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'USER'] },
  },
  {
    path: 'addLocation',
    component: AddLocationComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'paymentList',
    component: PaymentListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'USER'] },
  },
  {
    path: 'login',
    component: LoginComponent, // No guard, always accessible
  },
  {
    path: 'register',
    component: RegisterComponent, // No guard, always accessible
  },
  {
    path: '**', // Wildcard route for unmatched paths
    redirectTo: '/login', // Redirect to login if not authenticated
    pathMatch: 'full',
  },
];