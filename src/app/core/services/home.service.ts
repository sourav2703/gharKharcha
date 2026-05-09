import { Injectable } from '@angular/core';
import { Home } from '../../models/home.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private STORAGE_KEY = 'homes';

  getHomes() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  saveHomes(data: any[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  addHome(home: any) {
    const homes = this.getHomes();
    homes.push({ ...home, id: Date.now() });
    this.saveHomes(homes);
  }

updateHome(updated: Home) {
  const homes = this.getHomes().map((h: Home) =>
    h.id === updated.id ? updated : h
  );

  this.saveHomes(homes);
}

 deleteHome(id: number) {
  const homes = this.getHomes().filter((h: Home) => h.id !== id);
  this.saveHomes(homes);
}

 getHomeById(id: number) {
  return this.getHomes().find((h: Home) => h.id === id);
}
  selectedHome: any = null;
  
  setHome(home: any) {
    this.selectedHome = home;
  }
  
  getHome() {
    return this.selectedHome;
  }
  
}