import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  user: any;
  isAdmin = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.isAdmin = this.user?.role === 'admin';
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}