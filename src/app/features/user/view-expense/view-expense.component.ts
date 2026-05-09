import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

// Service
import { ExpenseService } from '../../../core/services/expense.service';

@Component({
  standalone: true,
  selector: 'app-view-expense',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DropdownModule
  ],
  templateUrl: './view-expense.component.html'
})
export class ViewExpenseComponent implements OnInit {

  homeId!: number;

  expenses: any[] = [];
  filteredExpenses: any[] = [];

  categories: string[] = [];
  selectedCategory: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService
  ) {}

  ngOnInit() {
    this.homeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExpenses();
  }

  loadExpenses() {
    this.expenses = this.expenseService.getExpensesByHome(this.homeId);
    this.filteredExpenses = [...this.expenses];

    this.categories = [...new Set(this.expenses.map(e => e.category?.name))];
  }

  filterCategory() {
    if (!this.selectedCategory) {
      this.filteredExpenses = [...this.expenses];
    } else {
      this.filteredExpenses = this.expenses.filter(
        e => e.category?.name === this.selectedCategory
      );
    }
  }

  deleteExpense(id: number) {
    this.expenseService.deleteExpense(id);
    this.loadExpenses();
  }

  editExpense(exp: any) {
    this.router.navigate(['/edit-expense', exp.id]);
  }

  goBack() {
    this.router.navigate(['/dashboard', this.homeId]);
  }
}