import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './backend/services/token-storage.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Calculator';
  isLoggedIn = false;
  username: string;
  id: string;

  constructor(
    private tokenStorageService: TokenStorageService,

    ) {}

  ngOnInit() {

  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
