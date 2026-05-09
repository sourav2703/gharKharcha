import { Injectable } from "@angular/core";
import { User } from "../../models/user.model";

@Injectable({ providedIn: 'root' })
export class AuthService {

  users = [
    { id: 1, name: 'Admin', username: 'admin', password: '1234', role: 'admin' },
    { id: 2, name: 'Sourav', username: 'user', password: '1234', role: 'user', homeId: 1 }
  ];

  login(username: string, password: string, role: string) {
    const user = this.users.find(
      u => u.username === username && u.password === password && u.role === role
    );

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }

    return null;
  }

  signup(user: any) {
    user.id = this.users.length + 1;
    this.users.push(user);
  }

  getCurrentUser(): User | null {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  logout() {
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}