import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:3000/api/v1';
  private tokenKey = 'authToken';
  private refreshTokenKey = 'refreshToken';

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<any> {

    return this.httpClient.post<any>(`${this.API_URL}/auth/login`, { email, password }).pipe(
      tap((response:any) => {
       
        if (response.token) {
          console.log(response.token);
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.autoRefreshToken();
        }
          
      })
     
    )    
  }


  refeshToken(): Observable<any> {

    const refreshToken = this.getRefreshToken();
    return this.httpClient.post<any>(`${this.API_URL}/auth/refresh`, { refreshToken }).pipe(
      tap((response:any) => {
       
        if (response.token) {
          console.log(response.token);
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.autoRefreshToken();
        }
          
      })
     
    )    
  }


  autoRefreshToken() {
    const token = this.getToken();
    if (!token)
      return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;  // milisegundos
    const timeout = exp - Date.now() - (60 * 1000);  // cuando falte 1 minuto para expirar

    setTimeout(() => {
      this.refeshToken().subscribe();
    }, timeout);


  }


  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null{
    
    if (typeof window !== undefined) {
      return localStorage.getItem(this.tokenKey); 
    } else {
      return null;
    }
    
  }


  private setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  private getRefreshToken(): string | null{
    
    if (typeof window !== undefined) {
      return localStorage.getItem(this.refreshTokenKey); 
    } else {
      return null;
    }
    
  }


  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token)
      return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;  // milisegundos

    return Date.now() < exp;
  }


  logOut(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.router.navigate(['/login']);
  }

}
