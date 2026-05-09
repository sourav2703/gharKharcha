import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { ExpenseService } from '../../../core/services/expense.service';
import { HomeService } from '../../../core/services/home.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, CardModule, ProgressBarModule, TableModule, ButtonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  home: any;
  homeId: number = 0;

  expenses: any[] = [];
  recentExpenses: any[] = [];
  categories: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService,
    private homeService: HomeService
  ) {}

  ngOnInit() {
    this.homeId = Number(this.route.snapshot.paramMap.get('id'));

    // ✅ Get Home (with category budgets)
    this.home = this.homeService.getHomeById(this.homeId);

    this.loadDashboardData();
  }

  // 🔥 LOAD REAL DATA
  loadDashboardData() {

    // ✅ Get expenses
    this.expenses = this.expenseService.getExpensesByHome(this.homeId);

    // ✅ Recent expenses
    this.recentExpenses = [...this.expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    // 🔥 Get category budgets from home
    const homeBudgets = this.home?.categoryBudgets || [];

    const budgetMap = new Map<string, number>();

    homeBudgets.forEach((b: any) => {
      budgetMap.set(b.name, b.amount);
    });

    // 🔥 Aggregate used per category
    const map = new Map<string, any>();

    this.expenses.forEach(exp => {
      const cat = exp.category?.name;
      if (!cat) return;

      if (!map.has(cat)) {
        map.set(cat, {
          name: cat,
          allocated: budgetMap.get(cat) || 0, // ✅ REAL DATA
          used: 0
        });
      }

      map.get(cat).used += exp.total;
    });

    // 🔥 Ensure categories with budget but no expense also appear
    homeBudgets.forEach((b: any) => {
      if (!map.has(b.name)) {
        map.set(b.name, {
          name: b.name,
          allocated: b.amount,
          used: 0
        });
      }
    });

    this.categories = Array.from(map.values());
  }

  // ✅ TOTAL EXPENSE
  get totalExpense() {
    return this.expenses.reduce((sum, e) => sum + (e.total || 0), 0);
  }

  // ✅ REMAINING
  get remaining() {
    return (this.home?.totalIncome || 0) - this.totalExpense;
  }

  // ✅ CATEGORY %
  getPercentage(cat: any) {
    if (!cat.allocated) return 0;

    const value = (cat.used / cat.allocated) * 100;
    return Number(value.toFixed(2));
  }

  // 🚀 Navigation
  goToAddExpense() {
    this.router.navigate(['/add-expense', this.homeId]);
  }

  goToViewExpenses() {
    this.router.navigate(['/view-expenses', this.homeId]);
  }
}