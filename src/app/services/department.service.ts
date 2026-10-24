import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private apiUrl = 'http://localhost:3000/department';
  private supabase;

  constructor(private http: HttpClient, private authService: AuthService, private supabaseService: SupabaseService) { 
    this.supabase = this.supabaseService.getClient();
  }

  private getHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
        'X-User-ID': this.authService.getUserId()?.toString() || '',
        'X-Role-ID': this.authService.getRoleId()?.toString() || '',
      }),
    };
  }

  getAllDepartments(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  postDepartment(department: any): Observable<any> {
     return from(
       this.supabase
         .from('Department')
         .insert(department)
         .select()
     );
   }

  getDepartmentById(departmentId: number): Observable<any> {
    const url = `${this.apiUrl}/${departmentId}`;
    return this.http.get(url, this.getHeaders());
  }

  updateDepartment(departmentId: number, updatedDepartment: any): Observable<any> {
    const url = `${this.apiUrl}/u/${departmentId}`;
    return this.http.put(url, updatedDepartment, this.getHeaders());
  }

  deactivateDepartment(departmentId: number, deactivatedDepartment: {DeletedBy: any}): Observable<any> {
    const url = `${this.apiUrl}/d/${departmentId}`;
    return this.http.patch(url, deactivatedDepartment, this.getHeaders());
  }

  deleteDepartment(departmentId: number): Observable<any> {
    const url = `${this.apiUrl}/${departmentId}`;
    return this.http.delete(url, this.getHeaders());
  }
}