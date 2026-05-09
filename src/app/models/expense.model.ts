export interface Expense {
  id: number;
  category: any;
  subcategory: string;
  quantity: number;
  price: number;
  total: number;
  paidBy: any;
  date: string;
  homeId: number;
}