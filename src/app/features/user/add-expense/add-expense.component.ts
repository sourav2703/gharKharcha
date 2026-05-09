import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

import { ExpenseService } from '../../../core/services/expense.service';
import { HomeService } from '../../../core/services/home.service';

@Component({
  standalone: true,
  selector: 'app-add-expense',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule
  ],
  templateUrl: './add-expense.component.html'
})
export class AddExpenseComponent implements OnInit {

  form!: FormGroup;
  homeId!: number;
  home: any;

  // Categories
  categories = [
    {
      name: 'Food & Kitchen',
      subcategories: [
        'Grocery', 'Vegetables', 'Milk', 'Non-Veg', 'Gas Cylinder', 'Oil / Masala', 'Outside Food'
      ]
    },
    {
      name: 'Housing',
      subcategories: ['Rent', 'Electricity', 'Water', 'Maintenance']
    },
    {
      name: 'Travel',
      subcategories: ['Fuel', 'Auto / Cab', 'Train / Bus']
    },
    {
      name: 'Utilities',
      subcategories: ['Mobile Recharge', 'Internet', 'DTH']
    },
    {
      name: 'Personal',
      subcategories: ['Medical', 'Shopping', 'Salon']
    },
    {
      name: 'Others',
      subcategories: ['Festival', 'Guests', 'Misc']
    }
  ];

  subcategories: string[] = [];

  users = [
    { name: 'Sourav' },
    { name: 'Papa' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService,
    private homeService: HomeService
  ) {}

  ngOnInit() {

    this.homeId = Number(this.route.snapshot.paramMap.get('id'));

    // ✅ Get Home from LocalStorage
    const homeData = this.homeService.getHomeById(this.homeId);

    // ✅ Calculate used dynamically
    const expenses = this.expenseService.getExpensesByHome(this.homeId);

    const used = expenses.reduce((sum: number, e: any) => {
      return sum + (e.total || 0);
    }, 0);

    this.home = {
      ...homeData,
      used
    };

    // ✅ Form
    this.form = this.fb.group({
      category: [null, Validators.required],
      subcategory: [null, Validators.required],

      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(1)]],
      total: [{ value: 0, disabled: true }],

      title: ['', Validators.required],
      paidBy: [null, Validators.required],
      date: [new Date(), Validators.required],
      note: ['']
    });

    // 🔥 Auto total calculation
    this.form.valueChanges.subscribe(val => {
      const qty = val.quantity || 0;
      const price = val.price || 0;

      const total = qty * price;

      this.form.patchValue(
        { total },
        { emitEvent: false }
      );
    });
  }

  // 🔁 Category change
  onCategoryChange(event: any) {
    const selectedCategory = this.categories.find(
      c => c.name === event.value?.name
    );

    this.subcategories = selectedCategory
      ? selectedCategory.subcategories
      : [];

    this.form.patchValue({ subcategory: null });
  }

  // 💾 Save expense
  saveExpense() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const expense = {
      ...this.form.getRawValue(),
      homeId: this.homeId
    };

    // ✅ Save to LocalStorage
    this.expenseService.addExpense(expense);

    // ❌ Do NOT manually update used
    this.router.navigate(['/dashboard', this.homeId]);
  }

  // 🔙 Back
  goBack() {
    this.router.navigate(['/dashboard', this.homeId]);
  }

  get f() {
    return this.form.controls;
  }
}