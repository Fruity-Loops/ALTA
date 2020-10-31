import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.scss'],
})
export class GreetingComponent implements OnInit, OnDestroy, AfterViewInit{

  openRegistraion: boolean = environment.open_registration;
  constructor() {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    document.querySelector('body').classList.add('greeting');
  }

  ngOnDestroy(): void {
    document.querySelector('body').classList.remove('greeting');
  }
}
