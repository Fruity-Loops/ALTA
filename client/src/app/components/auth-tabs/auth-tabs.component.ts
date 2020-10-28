import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-auth-tabs',
  templateUrl: './auth-tabs.component.html',
  styleUrls: ['./auth-tabs.component.css'],
})
export class AuthTabsComponent implements OnInit {
  openRegistraion: boolean = environment.open_registration;
  constructor() {}

  ngOnInit(): void {}
}
