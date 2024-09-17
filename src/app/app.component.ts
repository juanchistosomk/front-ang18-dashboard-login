import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'dashboard-18';
  
  constructor( private authService: AuthService ) {}


  ngOnInit(): void {

    if (this.authService.isAuthenticated())
      this.authService.autoRefreshToken();
    
  }




}
