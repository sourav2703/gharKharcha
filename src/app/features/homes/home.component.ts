import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { HomeService } from '../../core/services/home.service';
import { ExpenseService } from '../../core/services/expense.service';
import { Expense } from '../../models/expense.model';

@Component({
  standalone: true,
  selector: 'app-homes',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DialogModule,
    ProgressBarModule,
    FormsModule
  ],
  templateUrl: './home.component.html'
})
export class HomesComponent implements OnInit {

  user: any;
  isAdmin = false;

  showDialog = false;
  isEditMode = false;
  editHomeId: number | null = null;

  homes: any[] = [];

  categoryList = [
    'Food & Kitchen',
    'Housing',
    'Travel',
    'Utilities',
    'Personal',
    'Others'
  ];

  categoryBudgetInputs: number[] = [];

  newHome: any = {
    name: '',
    address: '',
    city: '',
    state: '',
    totalIncome: 0,
    members: 1,
    description: '',
    categoryBudgets: []
  };

  constructor(
    private router: Router,
    private homeService: HomeService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.isAdmin = this.user?.role === 'admin';
    this.loadHomes();
  }

  // 🔥 Load homes + calculate used
  loadHomes() {
    this.homes = this.homeService.getHomes();

    this.homes = this.homes.map(home => {
      const expenses = this.expenseService.getExpensesByHome(home.id);

      const used = expenses.reduce((sum: number, e: Expense) => {
        return sum + (e.total || 0);
      }, 0);

      return { ...home, used };
    });
  }

  // 📊 Calculations
  getRemaining(home: any) {
    return home.totalIncome - (home.used || 0);
  }

  getPercentage(home: any) {
    const value = home.totalIncome
      ? ((home.used || 0) / home.totalIncome) * 100
      : 0;

    return Number(value.toFixed(2));
  }

  // ➕ Add
  openDialog() {
    this.isEditMode = false;

    this.newHome = {
      name: '',
      address: '',
      city: '',
      state: '',
      totalIncome: 0,
      members: 1,
      description: '',
      categoryBudgets: []
    };

    this.categoryBudgetInputs = new Array(this.categoryList.length).fill(0);

    this.showDialog = true;
  }

  // ✏️ Edit
  editHome(home: any) {
    this.isEditMode = true;
    this.editHomeId = home.id;

    this.newHome = { ...home };

    // preload budgets
    this.categoryBudgetInputs = this.categoryList.map(cat => {
      const found = home.categoryBudgets?.find((c: any) => c.name === cat);
      return found ? found.amount : 0;
    });

    this.showDialog = true;
  }

  // 💾 Save
  saveHome() {

    if (!this.newHome.name || !this.newHome.address || !this.newHome.totalIncome) {
      alert('Name, Address and Budget required');
      return;
    }

    const totalAllocated = this.categoryBudgetInputs.reduce(
      (sum, val) => sum + (val || 0),
      0
    );

    if (totalAllocated > this.newHome.totalIncome) {
      alert('Category budget exceeds total budget');
      return;
    }

    const categoryBudgets = this.categoryList.map((cat, i) => ({
      name: cat,
      amount: this.categoryBudgetInputs[i] || 0
    }));

    const homeData = {
      ...this.newHome,
      categoryBudgets
    };

    if (this.isEditMode && this.editHomeId !== null) {
      this.homeService.updateHome({
        ...homeData,
        id: this.editHomeId
      });
    } else {
      this.homeService.addHome(homeData);
    }

    this.showDialog = false;
    this.loadHomes();
  }

  // ❌ Delete
  deleteHome(id: number) {
    if (!this.isAdmin) return;

    this.homeService.deleteHome(id);
    this.loadHomes();
  }

  // 🔗 Navigate
  viewHome(home: any) {
    this.router.navigate(['/dashboard', home.id]);
  }
}