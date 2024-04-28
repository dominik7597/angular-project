import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'todo-front';
  showMenu = true;
  username = '';
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.jwtUserToken.subscribe((token) => {
      if (token) {
        const decoded: any = jwtDecode(token);
        const expirationTime = decoded.exp * 1000;
        const currentTime = new Date().getTime();
        if (expirationTime < currentTime) {
          this.logout();
        } else {
          this.username = decoded.username;
          this.checkTokenExpiration(expirationTime);
        }
      }

      if (this.username) {
        this.showMenu = false;
      } else {
        this.showMenu = true;
      }
    });
  }

  private checkTokenExpiration(expirationTime: number) {
    const currentTime = new Date().getTime();
    const timeUntilExpiration = expirationTime - currentTime;
    if (timeUntilExpiration > 0) {
      setTimeout(() => {
        this.logout();
      }, timeUntilExpiration);
    }
  }

  logout() {
    this.username = '';
    this.apiService.logout();
  }
}
