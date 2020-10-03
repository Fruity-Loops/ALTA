import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private tokenService: TokenService, private router: Router) {}

  ngOnInit(): void {}

  logout() {
    this.tokenService.DeleteToken(); //Delete token when user logout
    this.router.navigate(['']); //redirect user to login/register pager

    //TODO: Check out if we want to delete also the token from the db, in order to regenerate a new one while logging in
  }
}
