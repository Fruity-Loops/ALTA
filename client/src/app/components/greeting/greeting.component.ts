import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {env} from 'src/environments/environment';


@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.scss'],
})
export class GreetingComponent implements OnInit, OnDestroy, AfterViewInit {

  openRegistraion: boolean = env.open_registration;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    document.querySelector('body').classList.add('greeting');
  }

  ngOnDestroy(): void {
    document.querySelector('body').classList.remove('greeting');
  }
}
