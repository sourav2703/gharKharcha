import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private STORAGE_KEY = 'expenses';

  getExpenses() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  getExpensesByHome(homeId: number) {
    return this.getExpenses().filter((e: any) => e.homeId === homeId);
  }

  addExpense(expense: any) {
    const data = this.getExpenses();
    data.push({ ...expense, id: Date.now() });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  deleteExpense(id: number) {
    const data = this.getExpenses().filter((e: any) => e.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  updateExpense(updated: any) {
    const data = this.getExpenses().map((e: any) =>
      e.id === updated.id ? updated : e
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
}